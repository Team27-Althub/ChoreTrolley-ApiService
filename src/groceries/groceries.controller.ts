import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GroceriesService } from './providers/groceries.service';
import { GetGroceryFilterQueryDto } from './dtos/GetGroceryPaginationQuery';
import { CreateGroceryDto } from './dtos/CreateGroceryDto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateGroceryDto } from './dtos/UpdateGroceryDto';
import { SkipResponseWrapper } from '../common/decorators/skip-response.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiResponse({ status: 201, description: 'Grocery created successfully' })
  async create(
    @Body() createGroceryDto: CreateGroceryDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this._groceriesService.createGrocery(createGroceryDto, userId);
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
