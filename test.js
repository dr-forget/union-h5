const arrs = [
  { tb_trade_id: 1, tk_refund_time: '2024-06-23 18:20:25' },
  { tb_trade_id: 1, tk_refund_time: '2024-06-23 18:21:25' },
  { tb_trade_id: 2, tk_refund_time: '2024-06-23 18:20:25' },
  { tb_trade_id: 2, tk_refund_time: '2024-06-23 18:22:25' },
  { tb_trade_id: 3, tk_refund_time: '2024-06-23 18:20:25' },
  { tb_trade_id: 3, tk_refund_time: '2024-06-23 18:22:25' },
  { tb_trade_id: 4, tk_refund_time: '2024-06-23 18:20:25' },
  { tb_trade_id: 5, tk_refund_time: '2024-06-23 18:20:25' },
];
const removeDuplicates = (data) => {
  const uniqueData = {};

  data.forEach((item) => {
    const tbTradeId = item.tb_trade_id;
    const tkRefundTime = new Date(item.tk_refund_time);

    if (!uniqueData[tbTradeId] || tkRefundTime > new Date(uniqueData[tbTradeId].tk_refund_time)) {
      uniqueData[tbTradeId] = item;
    }
  });

  return Object.values(uniqueData);
};

const filteredData = removeDuplicates(arrs);
console.log(filteredData);
