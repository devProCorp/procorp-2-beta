export interface Service {
  id: string;
  title: string;
  description: string;
  detail: string;
  image: string;
  slug: string;
  heroImage: string;
  galleryImages: [string, string];
  icon: string;
  features: [string, string, string];
}

export const services: Service[] = [
  {
    id: '01',
    title: 'svc.01.title',
    description: 'svc.01.desc',
    detail: 'svc.01.detail',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfyFVGpCbjP10XYbdgBEzkqI6Dug3VrNa4neeD-e1hKg-zAoiH2qGpgD4Dg20JyS18r4vkAqq5hOjMEchNoai4KiB_SRIC2soV1o3bcfN2A4myEoWZD49rCE_cxc3ks51rv_mB5dAW0c2KtPcMnscJ4QsUGYjtmXJOhMqIklhVIJY8dOdU9SX14_dk6ItO87xz2CCMdPhLwUEafYiS0UPlm8AMsyzMoPAie3g-14QEZ2CtZfJpeOCRrrwqJZ2uMbrZ4IwRXIlTQY',
    slug: 'legal-solutions',
    heroImage:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1450101499163-c8848e66ad76?w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    ],
    icon: 'gavel',
    features: ['svc.01.feat1', 'svc.01.feat2', 'svc.01.feat3'],
  },
  {
    id: '02',
    title: 'svc.02.title',
    description: 'svc.02.desc',
    detail: 'svc.02.detail',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZ4Ki7iKrGBdLR_b0gujcyOc9djET-yN84zqDeYcI5T51Dg_WibImUU0vM362HpyaELNqntpnTqmObieZG3vSQuvHiqm9GzYCuCnyuyyObsJV2lQ97YBy21nwx3BaZCf_FPrSf538D7HdAXr6kaiUX14DmmZ5CB9GHrgLkQTwRtynGmmLjnoD86K8p3Bj_5ZC822GtozBX2qj21jhFFNZJGTizxE6xFqTw2HaQyQRCCWLnyTTV3Ie3MI-ciWf-foAxN-bqtvb2H8',
    slug: 'sustainable-growth',
    heroImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    ],
    icon: 'trending_up',
    features: ['svc.02.feat1', 'svc.02.feat2', 'svc.02.feat3'],
  },
  {
    id: '03',
    title: 'svc.03.title',
    description: 'svc.03.desc',
    detail: 'svc.03.detail',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQoZCmCm1WSQCBQLbgYoozTOOnpnvBe4ykHJg5VBwK8qv8N20lkv7CY7Q6Ot8IZeIjDjPtbpq9O4qtTJRq5sVukoyOPrT41iwxwgysk5pluJgMHLvRXU4LAUc_Km6mdmApIiE5Qr2BP-sEKOAVzqvB2g55WDT2m07flvzRWeaGjnRWl2vaaeE8L9qA7LN8MYZxS7wcqievWI7_F8Vu1FXXiqcs2WZ2ICy0tZKiJlJj1xelA4AYo4U7PHjk2qJzaKucLXA-n2QFpoU',
    slug: 'ip2-engineering',
    heroImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    ],
    icon: 'memory',
    features: ['svc.03.feat1', 'svc.03.feat2', 'svc.03.feat3'],
  },
  {
    id: '04',
    title: 'svc.04.title',
    description: 'svc.04.desc',
    detail: 'svc.04.detail',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlsPLQx3rTZZCt2VRYGRuAlgtUS_a3ZMuLn6xDdKqx6haqQP8Gm5cf7RIBdKJ5iyRdJKwavhSL3rAXiUOU7vj3nNvwBEu6ve3i1C0vUUAVEuFeJQtDfR-EM6qNbCYqkdt2ZV5qRb039Ud3DMokxQw-Ks6NYQNV5CK_Ki-OqNknXorxHVS1_Vfak6puPl_aOAI56ISdygEjm2Ey3PKbyUbsb7cHfCMZIPQZ7A7xMpADYuD8GVWjgh26ToSTxBd_mwAWeW_-cufiGM',
    slug: 'exchange-platform',
    heroImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    ],
    icon: 'swap_horiz',
    features: ['svc.04.feat1', 'svc.04.feat2', 'svc.04.feat3'],
  },
  {
    id: '05',
    title: 'svc.05.title',
    description: 'svc.05.desc',
    detail: 'svc.05.detail',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpyQq2K2sN9ZzwgAstfFGSLSVizhxBZnVgGC_0MI8Y11PYzgbESdJhu6XabcGW_aE6M0U9bMEPZt1ggvnmEZK5nWW3BxYMBMg15UnVxOU_hLGX-evLgJb0b1Xeu23pms63mGEwa2WzDAiAavinU_toPqM3T1MmFLFcqc_rNVHOosAj9wOm12dg967RwyVNSbTR_l6B89KPYLe1KNQY_XctguHOP32nSKJfXwaPX9weHoBirwEV5_bYv_8eQUA4iyaivkjicOKGBN4',
    slug: 'business-process-automation',
    heroImage:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
    ],
    icon: 'settings_suggest',
    features: ['svc.05.feat1', 'svc.05.feat2', 'svc.05.feat3'],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getNextService(currentSlug: string): Service {
  const index = services.findIndex((s) => s.slug === currentSlug);
  return services[(index + 1) % services.length];
}
