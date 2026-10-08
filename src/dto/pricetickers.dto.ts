import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString,  IsNumber, isString } from 'class-validator';

export class TickerSearchDto {
 // @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  exchange?: string;

  //@IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  symbol?: string;

  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  page_no?: number;

  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  page_limit?: number;
}

export class MatchedSearchDto {
 // @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  buy_exchange?: string;

  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  sell_exchange?: string;

  //@IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  symbol?: string;

  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  category?: string;

  @IsString()
  @Transform(({ value }) => (value ? String(value) : ''))
  order_type?: string;

  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  plan_no?: number;

}