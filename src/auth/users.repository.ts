import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UsersRepository extends Repository<User>{
  async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto

    const hashedPass = await bcrypt.hash(password, await bcrypt.genSalt())
    const user = this.create({ 
      username, 
      password: hashedPass 
    })

    try {
      await this.save(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist')
      } 
      
      throw new InternalServerErrorException()
    }
  }
}