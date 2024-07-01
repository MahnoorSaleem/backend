import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

interface JwtPayload {
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(@Inject(forwardRef(() => UserService))
  private readonly UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.IGNORE_EXPIRATION,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.logger = new Logger(JwtStrategy.name);
  }

  async validate(payload: JwtPayload) {
    this.logger.log('Validate passport:', payload, 'hui');
    // issue here payload doesnot conatin email
    return await this.UserService.findOne({ email: payload.email });
  }
}