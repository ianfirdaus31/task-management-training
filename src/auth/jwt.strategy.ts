import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "src/auth/users.repository";
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { User } from "src/auth/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepo: UsersRepository
  ) {
    super({
      secretOrKey: 'rahasia',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload
    const user: User = await this.userRepo.findOne({ username })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}