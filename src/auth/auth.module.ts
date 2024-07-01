import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/localStrategy';
import { JwtStrategy } from './strategy/JwtStrategy';
// todo make env accissble
@Module({
  imports: [
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'mshduayenYGBSkxgsab',
    signOptions: { expiresIn: process.env.expiry || '3000s' },
    }),
    forwardRef(() => UserModule),
    PassportModule,
    ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
