const mongoose = require('mongoose');

// 스키마 구조 정의
const restaurantSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true, // id를 기준으로 빠른 검색을 위해 인덱스 설정
    },
    name: {
      type: String,
      required: true,
      index: true, // 이름으로 검색하는 경우가 많으므로 인덱스 설정
    },
    category: {
      type: String,
      required: true,
      index: true, // 카테고리별 필터링을 위해 인덱스 설정
    },
    location: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String,
      default: '정보 없음', // 데이터가 없을 때 기본값
    },
    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    recommendedMenu: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    // 타임스탬프 옵션
    timestamps: true, // createdAt, updatedAt 필드 자동 생성
  }
);

// JSON 변환(toJSON) 시 _id와 __v를 숨기고 id를 포함시키는 로직
restaurantSchema.set('toJSON', {
  transform: function (doc, ret) {
    // ret: 데이터베이스에서 조회한 원본 객체
    delete ret._id; // MongoDB의 기본 _id 필드 제거
    delete ret.__v; // Mongoose의 버전 키(__v) 필드 제거
  },
});

// 스키마를 기반으로 모델 생성 및 내보내기
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;