import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeFeed.vue')
    },
    {
      path: '/home-v2',
      name: 'HomeV2',
      component: () => import('../views/HomeFeed.vue')
    },
    {
      path: '/home-old',
      name: 'HomeOld',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/image-fallback-test',
      name: 'ImageFallbackTest',
      component: () => import('../views/ImageFallbackTest.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/points-mall',
      name: 'PointsMall',
      component: () => import('../views/PointsMall.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/vouchers',
      name: 'Vouchers',
      component: () => import('../views/Vouchers.vue')
    },
    {
      path: '/discover',
      name: 'Discover',
      component: () => import('../views/Discover.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../views/Search.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/mine',
      name: 'Mine',
      component: () => import('../views/Mine.vue')
    },
    {
      path: '/mine-redesigned',
      name: 'MineRedesigned',
      component: () => import('../views/MineRedesigned.vue')
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: () => import('../views/Notifications.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/earn-points',
      name: 'EarnPoints',
      component: () => import('../views/EarnPoints.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/check-in',
      name: 'CheckIn',
      component: () => import('../views/MapCheckIn.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/product-detail',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/product/:id',
      name: 'ProductDetailById',
      component: () => import('../views/ProductDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/voucher-center',
      name: 'VoucherCenter',
      component: () => import('../views/VoucherCenter.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/flash-sale',
      name: 'FlashSale',
      component: () => import('../views/FlashSale.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/trendy-products',
      name: 'TrendyProducts',
      component: () => import('../views/TrendyProducts.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/business-circle',
      alias: '/activity-center',
      name: 'ActivityCenter',
      component: () => import('../views/ActivityCenter.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/activity-detail/:id',
      alias: '/activity/:id',
      name: 'ActivityDetail',
      component: () => import('../views/ActivityDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/Orders.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/order-detail/:id',
      name: 'OrderDetail',
      component: () => import('../views/OrderDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/cashier',
      name: 'Cashier',
      component: () => import('../views/Cashier.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/logistics/:id',
      name: 'Logistics',
      component: () => import('../views/Logistics.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/after-sales/:id',
      name: 'AfterSales',
      component: () => import('../views/AfterSales.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/membership',
      name: 'Membership',
      component: () => import('../views/Membership.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/local-products',
      name: 'LocalProducts',
      component: () => import('../views/LocalProducts.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/heritage-brands',
      name: 'HeritageBrands',
      component: () => import('../views/HeritageBrands.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/gov-subsidy',
      name: 'GovSubsidy',
      component: () => import('../views/GovSubsidy.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/subsidy-applications/:id',
      name: 'SubsidyApplicationDetail',
      component: () => import('../views/SubsidyApplicationDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/qualification-claim',
      name: 'QualificationClaim',
      component: () => import('../views/QualificationClaim.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/subsidy-help',
      name: 'SubsidyHelp',
      component: () => import('../views/SubsidyHelp.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/local-vouchers',
      name: 'LocalVouchers',
      component: () => import('../views/LocalVouchers.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/foreign-trade',
      name: 'ForeignTrade',
      component: () => import('../views/ForeignTrade.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/sailor-economy',
      name: 'SailorEconomy',
      component: () => import('../views/SailorEconomy.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/real-name-auth',
      name: 'RealNameAuth',
      component: () => import('../views/RealNameAuth.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/merchant-offer-detail',
      name: 'MerchantOfferDetail',
      component: () => import('../views/MerchantOfferDetailEnhanced.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/merchant/:id',
      name: 'MerchantDetail',
      component: () => import('../views/MerchantDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/merchant-payment/:merchantId',
      name: 'MerchantPayment',
      component: () => import('../views/MerchantPayment.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/merchant-coupon-list',
      name: 'MerchantCouponList',
      component: () => import('../views/MerchantCouponList.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/address',
      name: 'AddressManagement',
      component: () => import('../views/AddressManagement.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/points-detail',
      name: 'PointsDetail',
      component: () => import('../views/PointsDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/redeem-records',
      name: 'RedeemRecords',
      component: () => import('../views/RedeemRecords.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('../views/Favorites.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../views/History.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/account-settings',
      name: 'AccountSettings',
      component: () => import('../views/AccountSettings.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/lottery-records',
      name: 'LotteryRecords',
      component: () => import('../views/LotteryRecords.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/invoice',
      name: 'Invoice',
      component: () => import('../views/Invoice.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/customer-service',
      name: 'CustomerService',
      component: () => import('../views/CustomerService.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: () => import('../views/Feedback.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/notification-settings',
      name: 'NotificationSettings',
      component: () => import('../views/NotificationSettings.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/privacy-settings',
      name: 'PrivacySettings',
      component: () => import('../views/PrivacySettings.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/help-center',
      name: 'HelpCenter',
      component: () => import('../views/HelpCenter.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/change-phone',
      name: 'ChangePhone',
      component: () => import('../views/ChangePhone.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('../views/ChangePassword.vue'),
      meta: { hideTabBar: true }
    },
    // 票根经济相关页面
    {
      path: '/ticket-upload',
      name: 'TicketUpload',
      component: () => import('../views/TicketUpload.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/my-tickets',
      name: 'MyTickets',
      component: () => import('../views/MyTickets.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/ticket-detail/:id',
      name: 'TicketDetail',
      component: () => import('../views/TicketDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/ticket-puzzle',
      name: 'TicketPuzzle',
      component: () => import('../views/TicketPuzzle.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/ticket-puzzle/:id',
      name: 'TicketPuzzleDetail',
      component: () => import('../views/TicketPuzzleDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/subsidy-help',
      name: 'SubsidyHelp',
      component: () => import('../views/SubsidyHelp.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/subsidy-help/:id',
      name: 'SubsidyHelpDetail',
      component: () => import('../views/SubsidyHelpDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/subsidy-applications',
      name: 'SubsidyApplications',
      component: () => import('../views/SubsidyApplications.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/lottery-center',
      name: 'LotteryCenter',
      component: () => import('../views/LotteryCenter.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/lottery-wheel',
      name: 'LotteryWheel',
      component: () => import('../views/LotteryWheel.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/lottery-statistics',
      name: 'LotteryStatistics',
      component: () => import('../views/LotteryStatistics.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/lottery-hall',
      redirect: '/lottery-center'
    },
    {
      path: '/lottery-detail/:id',
      name: 'LotteryDetail',
      component: () => import('../views/LotteryDetail.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/get-lottery-code',
      name: 'GetLotteryCode',
      component: () => import('../views/GetLotteryCode.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/lottery-draw',
      redirect: '/lottery-wheel'
    },
    {
      path: '/city-selector',
      name: 'CitySelector',
      component: () => import('../views/CitySelector.vue'),
      meta: { hideTabBar: true }
    },
    // 第三阶段新功能
    {
      path: '/map-checkin',
      name: 'MapCheckIn',
      component: () => import('../views/MapCheckIn.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/social-features',
      name: 'SocialFeatures',
      component: () => import('../views/SocialFeatures.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/city-rights',
      name: 'CityRights',
      component: () => import('../views/CityRights.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/stub-analytics',
      name: 'StubAnalytics',
      component: () => import('../views/StubAnalytics.vue'),
      meta: { hideTabBar: true }
    },
    // 苏超票根经济第一阶段
    {
      path: '/suchao-zone',
      name: 'SuchaoZone',
      component: () => import('../views/SuchaoZone.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/Checkout.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/consumer-guide',
      name: 'ConsumerGuide',
      component: () => import('../views/ConsumerGuide.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/match-calendar',
      name: 'MatchCalendar',
      component: () => import('../views/MatchCalendar.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/nearby',
      name: 'Nearby',
      component: () => import('../views/Nearby.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/error',
      name: 'Error',
      component: () => import('../views/ErrorPage.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: { hideTabBar: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

export default router

