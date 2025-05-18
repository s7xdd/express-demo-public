export const calculateOrderAmount = (items: any) => {
  let total = 0;
  items.forEach((item: any) => {
    total += item.amount;
  });
  return total;
};
