const tab = {
  tbk_relation_refund_response: {
    request_id: '16kt86ifcx5d4',
    result: {
      biz_error_code: 0,
      data: {
        page_no: '1',
        page_size: '1',
        results: {
          result: [
            {
              earning_time: '2024-06-21 14:38:28',
              modified_time: '2024-06-22 04:48:05',
              refund_fee: '49.9000',
              refund_status: 4,
              refund_type: 1,
              special_id: 3092725381,
              tb_auction_title: '2024夏季宝宝韩版凉鞋婴儿女童鞋子0-2岁儿女宝宝软底叫叫学步鞋',
              tb_trade_create_time: '2024-06-18 17:41:56',
              tb_trade_finish_price: '49.9000',
              tb_trade_id: 3937003417209620800,
              tb_trade_parent_id: 3937003417209620800,
              tk_pub_id: 122568319,
              tk_refund_time: '2024-06-21 14:35:53',
            },
          ],
        },
        total_count: '1',
      },
      result_code: 200,
    },
  },
};

const dayjs = require('dayjs');

const timer = dayjs('20240719').isBefore();
console.log(timer, 38);
