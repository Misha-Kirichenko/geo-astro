import { IsNumber, Min, IsNotEmpty, Max } from 'class-validator';
import { IsDateOnly } from 'src/common/decorators/is-date-only.decorator';

export class GeneratePromocodeDTO {
  @IsDateOnly()
  @IsNotEmpty()
  expiresAt: string;

  @IsNumber()
  @Min(1)
  usageLimit: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  discountPercent: number;
}
