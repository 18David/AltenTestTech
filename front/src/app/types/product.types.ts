import { JsonObject, JsonProperty, PropertyConvertingMode } from 'json2typescript';

@JsonObject('product')
export class Product {
  @JsonProperty("id", Number, PropertyConvertingMode.IGNORE_NULLABLE)
  id?: number = 0;
  @JsonProperty("code", String)
  code: string = '';
  @JsonProperty("name", String)
  name: string = '';
  @JsonProperty("description", String)
  description: string = '';
  @JsonProperty("price", Number)
  price: number = 0;
  @JsonProperty("quantity", Number)
  quantity: number = 0;
  @JsonProperty("inventoryStatus", String)
  inventoryStatus: string = '';
  @JsonProperty("category", String)
  category: string = '';
  @JsonProperty("image", String, PropertyConvertingMode.IGNORE_NULLABLE)
  image?: string = '';
  @JsonProperty("rating", Number, PropertyConvertingMode.IGNORE_NULLABLE)
  rating?: number = 0;
}

@JsonObject('products')
export class Products {
  @JsonProperty("data", [Product])
  data: Product[] = [];
  @JsonProperty("totalRecords", Number, PropertyConvertingMode.IGNORE_NULLABLE)
  totalRecords?: number = 0;
}
