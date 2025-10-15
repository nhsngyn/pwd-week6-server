const mongoose = require('mongoose');

// 스키마 구조 정의
const submissionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true, // id를 기준으로 빠른 검색을 위해 인덱스 설정
    },
    restaurantName: {
      type: String,
      required: true,
      index: true, // 식당 이름으로 검색하는 경우가 많으므로 인덱스 설정
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
      default: '', // 데이터가 없을 때 기본값
    },
    recommendedMenu: {
      type: [String],
      default: [],
    },
    review: {
      type: String,
      default: '',
    },
    submitterName: {
      type: String,
      default: '',
    },
    submitterEmail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // status 필드가 가질 수 있는 값을 제한
      default: 'pending', // 기본 상태는 'pending'
      index: true, // 처리 상태별(예: 'pending'인 제보만 보기) 조회를 위해 인덱스 설정
    },
  },
  {
    // 타임스탬프 옵션
    timestamps: true, // createdAt, updatedAt 필드 자동 생성
  }
);

// JSON으로 변환될 때 _id와 __v 필드를 제거하는 로직
submissionSchema.set('toJSON', {
  transform: function (doc, ret) {
    // ret: 데이터베이스에서 조회한 원본 객체
    delete ret._id; // MongoDB의 기본 _id 필드 제거
    delete ret.__v; // Mongoose의 버전 키(__v) 필드 제거
  },
});

// 스키마를 기반으로 모델 생성 및 내보내기
const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;