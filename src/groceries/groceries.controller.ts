import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, UseInterceptors
} from "@nestjs/common";
import { GroceriesService } from './providers/groceries.service';
import { GetGroceryFilterQueryDto } from './dtos/GetGroceryPaginationQuery';
import { CreateGroceryDto } from './dtos/CreateGroceryDto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateGroceryDto } from './dtos/UpdateGroceryDto';
import { SkipResponseWrapper } from '../common/decorators/skip-response.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFileToDto } from "../common/decorators/uploaded-file-to-dto";
import { CreateServiceDto } from "../services/dtos/CreateServiceDto";

@Controller('groceries')
@ApiTags('Groceries Module')
export class GroceriesController {
  constructor(private readonly _groceriesService: GroceriesService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all groceries paginated list' })
  @SkipResponseWrapper()
  async getAllGroceries(@Query() filterQuery: GetGroceryFilterQueryDto) {
    return this._groceriesService.getAllGroceries(filterQuery);
  }

  @Post('/create-grocery')
  @ApiOperation({ summary: 'Create a new Grocery' })
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiResponse({ status: 201, description: 'Grocery created successfully' })
  async create(
    @UploadedFileToDto({ field: 'imageUrl', dto: CreateGroceryDto })dto: CreateGroceryDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this._groceriesService.createGrocery(dto, userId);
  }

  @Put('/update-grocery/:id')
  async update(
    @CurrentUser('sub') userId: number,
    @Body() dto: UpdateGroceryDto,
  ) {
    return this._groceriesService.updateGrocery(userId, dto);
  }

  @Get('/:id')
  async getGrocery(@Param('id') id: number) {
    return this._groceriesService.findOneGrocery(id);
  }

  @Delete('/delete-grocery/:id')
  async deleteGrocery(
    @CurrentUser('sub') userId: number,
    @Param('id') groceryId: number,
  ) {
    return this._groceriesService.deleteGrocery(userId, groceryId);
  }
}
