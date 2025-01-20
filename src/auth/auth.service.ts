import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { UsersRepository } from 'src/auth/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepo.createUser(authCredentialDto)
  }

  async signIn(authCredentialDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto

    const user = await this.usersRepo.findOne({ username })
    if (!user) {
      throw new UnauthorizedException('Please check your login credential')
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { id: user.id, username }
      const accessToken = await this.jwtService.signAsync(payload)
      return { accessToken }
    }
  }
}
