from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, name, dob, sex, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            dob=dob,
            sex=sex
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, dob, sex, password):
        user = self.create_user(email=email, name=name, dob=dob, sex=sex, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    dob = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'dob', 'sex']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.name} ({self.email})"

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Orphan(BaseModel):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(18)]
    )
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    dob = models.DateField()
    unique_id = models.CharField(
        max_length=50,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^ORP-\d{6}$',
                message='Unique ID must be in format ORP-XXXXXX'
            )
        ]
    )
    id_proof = models.CharField(max_length=100)
    adopted = models.BooleanField(default=False)
    adoption_date = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name = 'Orphan'
        verbose_name_plural = 'Orphans'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} (ID: {self.unique_id})"

class EducationDetail(BaseModel):
    orphan = models.ForeignKey(
        Orphan,
        on_delete=models.CASCADE,
        related_name='education_details'
    )
    school_name = models.CharField(max_length=200)
    current_class = models.CharField(max_length=50)
    section = models.CharField(max_length=10)
    marks = models.JSONField(
        default=dict,
        help_text="Format: {'subject': 'marks'}"
    )
    academic_year = models.CharField(max_length=9)  # Format: 2023-2024

    class Meta:
        verbose_name = 'Education Detail'
        verbose_name_plural = 'Education Details'
        ordering = ['-academic_year']

class HealthDetail(BaseModel):
    orphan = models.ForeignKey(
        Orphan,
        on_delete=models.CASCADE,
        related_name='health_details'
    )
    health_condition = models.CharField(max_length=200)
    vaccine_name = models.CharField(max_length=100, blank=True, null=True)
    vaccine_date = models.DateField(blank=True, null=True)
    last_checkup_date = models.DateField(blank=True, null=True)
    next_checkup_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    medical_documents = models.FileField(
        upload_to='medical_documents/',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = 'Health Detail'
        verbose_name_plural = 'Health Details'
        ordering = ['-last_checkup_date']

class InventoryCategory(BaseModel):
    category_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Inventory Category'
        verbose_name_plural = 'Inventory Categories'
        ordering = ['category_name']

class InventoryItem(BaseModel):
    UNIT_CHOICES = [
        ('PCS', 'Pieces'),
        ('KG', 'Kilograms'),
        ('L', 'Liters'),
        ('BOX', 'Boxes')
    ]

    item_name = models.CharField(max_length=100)
    category = models.ForeignKey(
        InventoryCategory,
        on_delete=models.CASCADE,
        related_name='items'
    )
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=3, choices=UNIT_CHOICES, default='PCS')
    description = models.TextField(blank=True, null=True)
    minimum_quantity = models.PositiveIntegerField(
        default=0,
        help_text="Minimum quantity to maintain"
    )

    class Meta:
        verbose_name = 'Inventory Item'
        verbose_name_plural = 'Inventory Items'
        ordering = ['category', 'item_name']

class Donor(BaseModel):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in format: '+999999999'"
            )
        ]
    )
    address = models.TextField(blank=True, null=True)
    donated_items = models.ManyToManyField(
        InventoryItem,
        through='Donation',
        related_name='donors'
    )

    class Meta:
        verbose_name = 'Donor'
        verbose_name_plural = 'Donors'
        ordering = ['name']

class Donation(BaseModel):
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity_donated = models.PositiveIntegerField()
    donation_date = models.DateField(default=timezone.now)
    acknowledgment_sent = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Donation'
        verbose_name_plural = 'Donations'
        ordering = ['-donation_date']

class Volunteer(BaseModel):
    ROLE_CHOICES = [
        ('TEACHER', 'Teacher'),
        ('HEALTHCARE', 'Healthcare'),
        ('EVENT', 'Event Coordinator'),
        ('GENERAL', 'General Helper')
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in format: '+999999999'"
            )
        ]
    )
    address = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)
    background_check_completed = models.BooleanField(default=False)
    documents = models.FileField(
        upload_to='volunteer_documents/',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = 'Volunteer'
        verbose_name_plural = 'Volunteers'
        ordering = ['name']

class Adoption(BaseModel):
    orphan = models.OneToOneField(Orphan, on_delete=models.CASCADE)
    adopter_name = models.CharField(max_length=100)
    adopter_contact = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in format: '+999999999'"
            )
        ]
    )
    adoption_date = models.DateField()
    address = models.TextField()
    documents = models.FileField(
        upload_to='adoption_documents/',
        blank=True,
        null=True
    )
    verification_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Adoption'
        verbose_name_plural = 'Adoptions'
        ordering = ['-adoption_date']

    def save(self, *args, **kwargs):
        if not self.orphan.adopted:
            self.orphan.adopted = True
            self.orphan.adoption_date = self.adoption_date
            self.orphan.save()
        super().save(*args, **kwargs)