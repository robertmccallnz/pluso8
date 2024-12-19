import { ClientToolImplementation } from '@/sdk/ultravox-client';

export const updateOrderTool: ClientToolImplementation = (parameters) => {
  const { ...orderData } = parameters;

  if (typeof window !== "undefined") {
    const event = new CustomEvent("orderDetailsUpdated", {
      detail: orderData.orderDetailsData,
    });
    window.dispatchEvent(event);
  }

  return "Updated the order details.";
};
