import { AuthService } from './auth.service';
import { Controller, Post, Req, Res, UseGuards, Body } from '@nestjs/common';
import { CreateDto, LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/publick.decorator';
import { RefreshTokenGuard } from 'src/core/guards/refresh_guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthControler {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateDto })
  @Public()
  async register(@Body() data: CreateDto, @Res({ passthrough: true }) res: Response) {
    let token = await this.authService.register(data);
    let { access_token, refresh_token } = token;
    res.cookie('access-token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @Public()
  async login(@Res({ passthrough: true }) res: Response,@Body() data: LoginDto) {
    let token = await this.authService.login(data);

    let { access_token, refresh_token } = token;
    res.cookie('access-token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refresh_token(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    let token = await this.authService.login((req as any).user.id);
    let { refresh_token } = token;
    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
