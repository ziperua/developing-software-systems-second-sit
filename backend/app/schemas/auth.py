from pydantic import BaseModel, EmailStr, Field

class RegisterRequestDto(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=2, max_length=40)
    password: str = Field(min_length=6, max_length=128)
    confirm_password: str

class LoginRequestDto(BaseModel):
    email: EmailStr
    password: str

class UserResponseDto(BaseModel):
    id: str
    email: str
    display_name: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponseDto