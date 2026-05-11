from pydantic import BaseModel, EmailStr

class RegisterRequestDto(BaseModel):
    email: EmailStr
    display_name: str
    password: str
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