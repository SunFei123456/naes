import { Product } from '@/types/product';
import PCImage from '@/assets/product/p1.png';
import BHImage from '@/assets/product/p2.png';
import NMNImage from '@/assets/product/p3.png';
import PQQImage from '@/assets/product/p4.jpg';
import RTImage from '@/assets/product/p5.jpg';
import ETImage from '@/assets/product/p6.png';
import PSImage from '@/assets/product/p7.png';
import SPEImage from '@/assets/product/p8.png';
// import SPOImage from '@/assets/images/SPO.png';
import UAImage from '@/assets/images/UA.png';
import GTImage from '@/assets/images/GT.png';

export const PRODUCTS_DATA: Record<string, Product> = {
  pc: {
    id: 'pc',
    image: PCImage,
    specifications: [
      { percentage: '20%', state: '白色至浅黄色粉末', packaging: '1kg/袋' },
      { percentage: '25%', state: '白色至浅黄色粉末', packaging: '1kg/袋' },
      { percentage: '35%', state: '白色至浅黄色粉末', packaging: '1kg/袋' },
      { percentage: '50%', state: '白色至浅黄色粉末', packaging: '25kg/桶' },
      { percentage: '60%', state: '白色至浅黄色粉末', packaging: '25kg/桶' },
    ],
  },
  bh: {
    id: 'bh',
    image: BHImage,
    specifications: [
      { percentage: '97%', state: '淡黄色结晶粉末', packaging: '1kg/铝箔袋' },
      { percentage: '98%', state: '淡黄色结晶粉末', packaging: '25kg/桶' },
    ],
  },
  nmn: {
    id: 'nmn',
    image: NMNImage,
    specifications: [
      {
        percentage: '99%',
        state: '白色至微黄色结晶粉末',
        packaging: '1kg/铝箔袋',
      },
      {
        percentage: '99%',
        state: '白色至微黄色结晶粉末',
        packaging: '25kg/桶',
      },
    ],
  },
  pqq: {
    id: 'pqq',
    image: PQQImage,
    specifications: [
      {
        percentage: '98%',
        state: '红棕色粉末',
        packaging: '1kg/铝箔袋',
      },
      {
        percentage: '98%',
        state: '红棕色粉末',
        packaging: '25kg/桶',
      },
    ],
  },
  rt: {
    id: 'rt',
    image: RTImage,
    specifications: [
      {
        percentage: '5%',
        state: '白至淡黄色粉末',
        packaging: '1kg/袋',
      },
      {
        percentage: '50%',
        state: '白至淡黄色粉末',
        packaging: '1kg/袋',
      },
      {
        percentage: '99%',
        state: '白至淡黄色粉末',
        packaging: '1kg/袋',
      },
      {
        percentage: '99%',
        state: '白至淡黄色粉末',
        packaging: '25kg/桶',
      },
    ],
  },
  et: {
    id: 'et',
    image: ETImage,
    specifications: [
      {
        percentage: '99%',
        state: '白色粉末',
        packaging: '1kg/袋',
      },
      {
        percentage: '99%',
        state: '白色粉末',
        packaging: '25kg/桶',
      },
    ],
  },
  ps: {
    id: 'ps',
    image: PSImage,
    specifications: [
      {
        percentage: '20%',
        state: '白色至淡黄色粉末',
        packaging: '1kg/袋',
        source: 'Soy',
      },
      {
        percentage: '50%',
        state: '白色至淡黄色粉末',
        packaging: '1kg/袋',
        source: 'Soy',
      },
      {
        percentage: '70%',
        state: '白色至淡黄色粉末',
        packaging: '25kg/桶',
        source: 'Soy',
      },
      {
        percentage: '60%',
        state: '白色至淡黄色粉末',
        packaging: '25kg/桶',
        source: 'Sunflower seed',
      },
    ],
  },
  spe: {
    id: 'spe',
    image: SPEImage,
    specifications: [
      {
        percentage: '25% Fatty Acid',
        state: '类白色粉末',
        packaging: '1kg/袋',
        source: '',
      },
      {
        percentage: '45% Fatty Acid',
        state: '类白色粉末',
        packaging: '25kg/桶',
        source: '',
      },
    ],
  },
  // spo: {
  //   id: 'spo',
  //   image: SPOImage,
  //   specifications: [
  //     {
  //       percentage: '25% Fatty Acids',
  //       state: '',
  //       packaging: '',
  //     },
  //   ],
  // },
  ua: {
    id: 'ua',
    image: UAImage,
    specifications: [
      {
        percentage: '98%',
        state: '浅黄色至浅灰色的粉末',
        packaging: '1kg/袋',
      },
      {
        percentage: '98%',
        state: '浅黄色至浅灰色的粉末',
        packaging: '25kg/桶',
      },
    ],
  },
  gt: {
    id: 'gt',
    image: GTImage,
    specifications: [
      {
        percentage: '98%',
        state: '白色结晶性粉末',
        packaging: '1kg/袋',
      },
      {
        percentage: '98%',
        state: '白色结晶性粉末',
        packaging: '25kg/桶',
      },
    ],
  },
};

export const getAllProducts = () => Object.values(PRODUCTS_DATA);
export const getProductById = (id: string) => PRODUCTS_DATA[id];
