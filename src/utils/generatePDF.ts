import type { OrderInfo } from '@/services/order';
import template from '@/assets/template.png';
import moment from 'moment';
import jspdf from 'jspdf';

interface ItemType {
  x: number;
  y: number;
  text: string;
  font: string;
}

const fontType = {
  boldFont: '900 30px Arial',
  normalFont: '30px Arial',
};

const formatNumber = (num: number) => {
  return num
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
// 2021-04-29T02:12:02.909344Z
const formatDate = (utcDate: string) => {
  return moment(utcDate).zone(6).format('DD-MMM-YYYY');
};

const loadImage: (url: string) => Promise<HTMLImageElement> = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = url;
  });

export default async function generatePDF(
  orderDetail: OrderInfo,
  operator: string,
  method: 'download' | 'blob',
) {
  const positions = {
    header: {
      name: {
        x: 124,
        y: 643,
        text: orderDetail.companyClient?.name
          ? orderDetail.companyClient?.name
          : orderDetail.individualClient?.name ?? '',
        font: fontType.boldFont,
      },
      address: {
        x: 124,
        y: 687,
        text: orderDetail.companyClient?.address
          ? orderDetail.companyClient?.address
          : orderDetail.individualClient?.address ?? '',
        font: fontType.normalFont,
      },
      adnOrAcn: {
        x: 586,
        y: 821,
        text: orderDetail.companyClient?.abnOrAcn ?? '',
        font: fontType.normalFont,
      },
      transNo: {
        x: 1683,
        y: 644,
        text: orderDetail.orderNumber,
        font: fontType.normalFont,
      },
      operator: {
        x: 1683,
        y: 777,
        text: operator,
        font: fontType.normalFont,
      },
      referral: {
        x: 1683,
        y: 821,
        text: orderDetail.referral ?? '',
        font: fontType.normalFont,
      },
    },
    contractDetails: {
      contractDate: {
        x: 538,
        y: 1037,
        text: orderDetail.createdDate
          ? formatDate(orderDetail.createdDate)
          : '',
        font: fontType.boldFont,
      },
      valueDate: {
        x: 1440,
        y: 1037,
        text: orderDetail.createdDate
          ? formatDate(orderDetail.createdDate)
          : '',
        font: fontType.boldFont,
      },
      rate: {
        x: 2200,
        y: 1037,
        text: orderDetail.baseRate ? formatNumber(orderDetail.baseRate) : '',
        font: fontType.boldFont,
      },
      weBuysCurrency: {
        x: 538,
        y: 1081,
        text: orderDetail.fromCurrency ?? '',
        font: fontType.boldFont,
      },
      weBuys: {
        x: 865,
        y: 1081,
        text: orderDetail.fromAmount
          ? formatNumber(orderDetail.fromAmount)
          : '',
        font: fontType.boldFont,
      },
      weSellsCurrency: {
        x: 1440,
        y: 1081,
        text: orderDetail.toCurrency ?? '',
        font: fontType.boldFont,
      },
      weSells: {
        x: 1767,
        y: 1081,
        text: orderDetail.toAmount ? formatNumber(orderDetail.toAmount) : '',
        font: fontType.boldFont,
      },
    },
    orderClientDetails: {
      name: {
        x: 540,
        y: 1191,
        text: orderDetail.companyClient?.name
          ? orderDetail.companyClient?.name
          : orderDetail.individualClient?.name ?? '',
        font: fontType.boldFont,
      },
      address: {
        x: 540,
        y: 1249,
        text: orderDetail.companyClient?.address
          ? orderDetail.companyClient?.address
          : orderDetail.individualClient?.address ?? '',
        font: fontType.boldFont,
      },
    },
    clientsPays: {
      amountCurrency: {
        x: 831,
        y: 1364,
        text: orderDetail.fromCurrency ?? '',
        font: fontType.boldFont,
      },
      amount: {
        x: 1212,
        y: 1364,
        text: orderDetail.fromAmount
          ? formatNumber(orderDetail.fromAmount)
          : '',
        font: fontType.boldFont,
      },
      method: {
        x: 831,
        y: 1422,
        text: 'Bank Transfer',
        font: fontType.boldFont,
      },
    },
    feeDetails: {
      clientType: {
        x: 831,
        y: 1531,
        text: 'VIP',
        font: fontType.boldFont,
      },
      amountCurrency: {
        x: 831,
        y: 1594,
        text: orderDetail.feeCurrency ?? '',
        font: fontType.boldFont,
      },
      amount: {
        x: 1212,
        y: 1594,
        text: orderDetail.feeAmount ? formatNumber(orderDetail.feeAmount) : '',
        font: fontType.boldFont,
      },
    },
    globalpayPays: {
      amountCurrency: {
        x: 831,
        y: 1710,
        text: orderDetail.toCurrency ?? '',
        font: fontType.boldFont,
      },
      amount: {
        x: 1212,
        y: 1710,
        text: orderDetail.toAmount ? formatNumber(orderDetail.toAmount) : '',
        font: fontType.boldFont,
      },
      method: {
        x: 831,
        y: 1767,
        text: 'Bank Transfer',
        font: fontType.boldFont,
      },
      beneficiaryName: {
        x: 831,
        y: 1821,
        text: orderDetail.receiver.name,
        font: fontType.boldFont,
      },
      bank: {
        x: 831,
        y: 1880,
        text: orderDetail.receiver.bankName,
        font: fontType.boldFont,
      },
      accountNumber: {
        x: 831,
        y: 1942,
        text: orderDetail.receiver.accountNumber,
        font: fontType.boldFont,
      },
      bsb: {
        x: 831,
        y: 2002,
        text: orderDetail.receiver.bsb,
        font: fontType.boldFont,
      },
      reference: {
        x: 831,
        y: 2060,
        text: '',
        font: fontType.boldFont,
      },
    },
    summary: {
      receivesCurrency: {
        x: 1441,
        y: 2114,
        text: orderDetail.fromCurrency ?? '',
        font: fontType.boldFont,
      },
      receives: {
        x: 1767,
        y: 2114,
        text: orderDetail.fromAmount
          ? formatNumber(orderDetail.fromAmount)
          : '',
        font: fontType.boldFont,
      },
      paysCurrency: {
        x: 1441,
        y: 2173,
        text: orderDetail.toCurrency ?? '',
        font: fontType.boldFont,
      },
      pays: {
        x: 1767,
        y: 2173,
        text: orderDetail.toAmount ? formatNumber(orderDetail.toAmount) : '',
        font: fontType.boldFont,
      },
    },
  };

  let dataArr: ItemType[] = [];
  for (let part of Object.values(positions)) {
    for (let item of Object.values(part)) {
      dataArr.push(item);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2489;
  canvas.height = 3521;
  const img = await loadImage(template);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(img, 0, 0);
  for (let item of dataArr) {
    ctx.font = item.font;
    ctx.fillText(item.text, item.x, item.y + 25);
  }
  const pageData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jspdf('p', 'pt', 'a4', true);
  pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 841.89);
  switch (method) {
    case 'download':
      pdf.save('test.pdf');
      break;
    case 'blob':
      return pdf.output('blob');
    default:
      return;
  }
}
