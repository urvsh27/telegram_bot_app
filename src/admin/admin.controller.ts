/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
// Admin controllers
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  // Get weather api token
  @Get('api-token')
  async getWeatherApiKey():Promise<any> {
    return await this.adminService.getWeatherApiKey();
  }

  // Create or update weather api token
  @Post('api-token')
  async setApiToken(@Body() apiToken: { weatherApiKey: string }) :Promise<any> {
    try {
      const result = await this.adminService.setApiToken(apiToken.weatherApiKey);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Admin login
  @Post('/login')
  async login(@Body('token') token): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();
    const data = await this.adminService.login({
      email,
      name,
      image: picture,
      isAdmin: true,
    });
    return {
      data,
      message: 'User login successfully.',
    };
  }
}
