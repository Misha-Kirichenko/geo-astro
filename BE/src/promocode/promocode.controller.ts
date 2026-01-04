import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { AuthJwtGuard } from 'src/common/guards';
import { GeneratePromocodeDTO } from './dto/generate-promocode.dto';
import {
  IPromocode,
  IPromocodeWithProvider,
} from './interfaces/promocode.interface';

@Controller('promocode')
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) { }

  @UseGuards(AuthJwtGuard)
  @Post('/generate/:tgId')
  generatePromocode(
    @Param('tgId') tgId: number,
    @Body() promocodeDTO: GeneratePromocodeDTO,
  ): Promise<IPromocode> {
    return this.promocodeService.generatePromocode(tgId, promocodeDTO);
  }

  @UseGuards(AuthJwtGuard)
  @Get('/:alias')
  getPromocode(@Param('alias') alias: string): Promise<IPromocodeWithProvider> {
    return this.promocodeService.getPromocode(alias);
  }
}
