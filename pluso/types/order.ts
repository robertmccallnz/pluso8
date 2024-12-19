export interface OrderItem {
  name: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
}

export interface OrderDetailsData {
  items: OrderItem[];
  totalAmount: number;
}

export interface SelectedTool {
  temporaryTool: {
    modelToolName: string;
    description: string;
    dynamicParameters: {
      name: string;
      location: string;
      schema: any;
      required: boolean;
    }[];
    client: Record<string, never>;
  };
}
