<p align="center">
  <img src="./assets/images/icon.png" alt="Dormitory Social App" width="120" height="120" />
</p>

<h1 align="center">Dormitory Social App</h1>

<p align="center">
  <strong>Ứng dụng quản lý ký túc xá & mạng xã hội nội bộ dành cho sinh viên</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NativeWind-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="NativeWind" />
  <img src="https://img.shields.io/badge/License-Private-red" alt="License" />
</p>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Kiến trúc & Công nghệ](#-kiến-trúc--công-nghệ)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Biến môi trường](#-biến-môi-trường)
- [Scripts](#-scripts)
- [Đóng góp](#-đóng-góp)

---

## 🏠 Giới thiệu

**Dormitory Social App** là ứng dụng di động đa nền tảng (iOS & Android) phục vụ quản lý ký túc xá và kết nối cộng đồng sinh viên. Ứng dụng cung cấp hệ thống quản lý toàn diện với **3 vai trò chính**: Admin, Manager (quản lý tòa nhà) và Student (sinh viên), mỗi vai trò có giao diện và chức năng riêng biệt.

Ứng dụng được xây dựng trên nền tảng **React Native** với **Expo SDK 54**, sử dụng kiến trúc **file-based routing** thông qua Expo Router, đảm bảo trải nghiệm mượt mà và hiệu suất cao.

---

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền
- Đăng nhập / Đăng ký tài khoản
- Phân quyền theo vai trò (Admin, Manager, Student)
- JWT authentication với tự động refresh token
- Lưu trữ token an toàn qua **Expo Secure Store**

### 👨‍🎓 Sinh viên (Student)
| Tính năng | Mô tả |
|-----------|--------|
| **Phòng của tôi** | Xem thông tin phòng hiện tại, danh sách thành viên |
| **Tìm & Đăng ký phòng** | Duyệt phòng trống, xem chi tiết và đăng ký trực tuyến |
| **Hợp đồng** | Xem và quản lý hợp đồng thuê phòng |
| **Hóa đơn** | Theo dõi và thanh toán hóa đơn phòng |
| **Cộng đồng** | Đăng bài, tương tác với cộng đồng KTX |
| **Trò chuyện** | Nhắn tin trực tiếp real-time với SignalR |
| **Báo cáo sự cố** | Gửi và theo dõi báo cáo sự cố phòng |
| **Hồ sơ cá nhân** | Xem và chỉnh sửa thông tin cá nhân |

### 🏢 Quản lý tòa nhà (Manager)
| Tính năng | Mô tả |
|-----------|--------|
| **Quản lý phòng** | Tạo, xem chi tiết và quản lý danh sách phòng |
| **Quản lý hóa đơn** | Tạo và theo dõi hóa đơn cho sinh viên |
| **Xử lý sự cố** | Tiếp nhận và xử lý báo cáo sự cố |
| **Quản lý nội dung** | Quản lý bài đăng cộng đồng |
| **Trò chuyện** | Liên lạc trực tiếp với sinh viên |

### ⚙️ Quản trị viên (Admin)
| Tính năng | Mô tả |
|-----------|--------|
| **Dashboard** | Tổng quan thống kê hệ thống |
| **Quản lý người dùng** | Tạo, xem và quản lý tài khoản người dùng |
| **Quản lý nội dung** | Kiểm duyệt nội dung cộng đồng |
| **Trò chuyện** | Liên lạc nội bộ |

### 🌐 Tính năng chung
- 🔔 Thông báo real-time qua **SignalR**
- 🌙 Hỗ trợ dark mode (tự động theo hệ thống)
- 📶 Cảnh báo mất kết nối mạng
- 🎨 Giao diện hiện đại với gradient, animation mượt mà
- ⚡ Haptic feedback trên thiết bị hỗ trợ

---

## 🛠 Kiến trúc & Công nghệ

### Core Stack

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| [React Native](https://reactnative.dev/) | 0.81.5 | Framework mobile cross-platform |
| [Expo](https://expo.dev/) | SDK 54 | Development platform & toolchain |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Expo Router](https://docs.expo.dev/router/) | 6.x | File-based routing |
| [NativeWind](https://www.nativewind.dev/) | 4.x | Utility-first styling (TailwindCSS) |

### Thư viện chính

| Thư viện | Vai trò |
|----------|---------|
| **Axios** | HTTP client với interceptor tự động |
| **@microsoft/signalr** | Real-time messaging (chat) |
| **expo-secure-store** | Lưu trữ token bảo mật |
| **expo-image** | Hiển thị ảnh hiệu suất cao |
| **expo-image-picker** | Chọn ảnh từ thiết bị |
| **react-native-reanimated** | Animation 60fps |
| **react-native-gesture-handler** | Xử lý gesture (swipe, drag) |
| **react-native-chart-kit** | Biểu đồ thống kê |
| **react-native-markdown-display** | Hiển thị nội dung Markdown |
| **date-fns** | Xử lý ngày tháng |
| **jwt-decode** | Giải mã JWT token |

### Kiến trúc ứng dụng

```
┌─────────────────────────────────────────────────┐
│                  Expo Router                     │
│            (File-based Routing)                  │
├──────────┬──────────┬───────────┬───────────────┤
│  (auth)  │ (student)│ (manager) │    (admin)    │
│  Login   │ My Room  │  Rooms    │  Dashboard    │
│ Register │ Booking  │ Invoices  │  Users Mgmt   │
│          │ Community│ Reports   │  Content Mgmt │
│          │ Chat     │ Chat      │  Chat         │
│          │ Profile  │           │               │
├──────────┴──────────┴───────────┴───────────────┤
│              Services Layer (Axios + SignalR)     │
│         HTTP Interceptors / Token Refresh         │
├─────────────────────────────────────────────────┤
│          Secure Storage (Expo Secure Store)       │
└─────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc thư mục

```
dormitory-social-app/
├── app/                          # Expo Router - định nghĩa routes
│   ├── (auth)/                   # Routes xác thực (login, register)
│   ├── (student)/                # Routes dành cho sinh viên
│   │   ├── my-room.tsx           # Màn hình phòng của tôi
│   │   ├── community.tsx         # Cộng đồng
│   │   ├── chat.tsx              # Danh sách chat
│   │   ├── rooms.tsx             # Tìm phòng
│   │   ├── rooms/[id].tsx        # Chi tiết phòng
│   │   ├── rooms/[id]/book.tsx   # Đăng ký phòng
│   │   ├── invoices/             # Hóa đơn
│   │   ├── contract/             # Hợp đồng
│   │   ├── incidents.tsx         # Danh sách sự cố
│   │   └── report-incident.tsx   # Báo cáo sự cố
│   ├── (manager)/                # Routes dành cho quản lý
│   │   ├── rooms.tsx             # Quản lý phòng
│   │   ├── room-details/         # Chi tiết phòng
│   │   ├── invoices/             # Quản lý hóa đơn
│   │   └── reports.tsx           # Xử lý sự cố
│   ├── (admin)/                  # Routes dành cho admin
│   │   ├── dashboard.tsx         # Tổng quan
│   │   ├── users.tsx             # Quản lý người dùng
│   │   └── user-details/         # Chi tiết người dùng
│   ├── chat/                     # Routes chat (shared)
│   │   └── [id].tsx              # Phòng chat
│   ├── _layout.tsx               # Root layout + auth guard
│   └── index.tsx                 # Entry redirect
│
├── src/                          # Source code chính
│   ├── components/               # UI components
│   │   ├── common/               # Components dùng chung
│   │   │   ├── ConfirmModal.tsx   # Modal xác nhận
│   │   │   ├── DraggableFAB.tsx   # Floating action button
│   │   │   ├── NetworkBanner.tsx  # Banner mất mạng
│   │   │   ├── Skeleton.tsx       # Loading skeleton
│   │   │   └── SwipeableRow.tsx   # Swipe action row
│   │   ├── navigation/           # Tab bar & navigation
│   │   ├── chat/                 # Chat components
│   │   ├── community/            # Community components
│   │   ├── room/                 # Room components
│   │   ├── student/              # Student-specific components
│   │   ├── manager/              # Manager-specific components
│   │   ├── admin/                # Admin-specific components
│   │   ├── profile/              # Profile components
│   │   ├── toast/                # Toast notification system
│   │   ├── AppButton.tsx         # Button component
│   │   ├── AppInput.tsx          # Input component
│   │   ├── AppModal.tsx          # Modal component
│   │   ├── AppSelect.tsx         # Select/Picker component
│   │   └── ScreenGradient.tsx    # Gradient background
│   │
│   ├── screens/                  # Màn hình chính (business logic + UI)
│   │   ├── auth/                 # Màn hình xác thực
│   │   ├── student/              # Màn hình sinh viên
│   │   ├── manager/              # Màn hình quản lý
│   │   ├── admin/                # Màn hình admin
│   │   ├── chat/                 # Màn hình chat
│   │   ├── shared/               # Màn hình dùng chung
│   │   └── settings/             # Màn hình cài đặt
│   │
│   ├── services/                 # API & services layer
│   │   ├── http.ts               # Axios instance + interceptors
│   │   ├── auth/                 # Auth API
│   │   ├── room/                 # Room API
│   │   ├── booking/              # Booking API
│   │   ├── billing/              # Billing/Invoice API
│   │   ├── contract/             # Contract API
│   │   ├── chat/                 # Chat/SignalR service
│   │   ├── community/            # Community/Social API
│   │   ├── incident/             # Incident report API
│   │   ├── profile/              # Profile API
│   │   ├── user/                 # User management API
│   │   ├── admin/                # Admin API
│   │   └── stats/                # Statistics API
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── auth/                 # Auth hooks
│   │   ├── room/                 # Room hooks
│   │   ├── chat/                 # Chat hooks
│   │   ├── community/            # Community hooks
│   │   └── ...                   # Hooks theo module
│   │
│   ├── config/                   # Cấu hình ứng dụng
│   │   └── env.ts                # Environment variables
│   │
│   ├── constants/                # Hằng số
│   │   ├── colors.ts             # Bảng màu ứng dụng
│   │   └── settings.ts           # Cấu hình settings
│   │
│   ├── storage/                  # Local storage layer
│   │   └── authStorage.ts        # Quản lý auth tokens
│   │
│   └── utils/                    # Tiện ích
│       ├── jwt.ts                # JWT decode & validation
│       ├── date.ts               # Xử lý ngày tháng
│       ├── room.ts               # Tiện ích phòng
│       ├── incident.ts           # Tiện ích sự cố
│       ├── communityUtils.ts     # Tiện ích cộng đồng
│       └── validators.tsx        # Validation helpers
│
├── assets/                       # Tài nguyên tĩnh
│   └── images/                   # Icons, splash screen, ...
│
├── app.json                      # Expo config (static)
├── app.config.ts                 # Expo config (dynamic)
├── babel.config.js               # Babel config
├── metro.config.js               # Metro bundler config
├── tailwind.config.js            # TailwindCSS / NativeWind config
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint config
├── global.css                    # Global CSS (NativeWind)
└── package.json                  # Dependencies & scripts
```

---

## 💻 Yêu cầu hệ thống

| Yêu cầu | Phiên bản |
|----------|-----------|
| **Node.js** | >= 18.x |
| **npm** | >= 9.x |
| **Expo CLI** | Được cài tự động qua `npx` |
| **Android Studio** | Để chạy trên Android emulator |
| **Xcode** | Để chạy trên iOS simulator (macOS only) |
| **Expo Go** | Để chạy trên thiết bị thật |

---

## 🚀 Cài đặt & Chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/pnson1322/dormitory-social-app.git
cd dormitory-social-app
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
API_BASE_URL="https://your-api-domain.com"
```

### 4. Chạy ứng dụng

```bash
# Khởi động Expo dev server
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên Web
npm run web
```

### 5. Chạy trên thiết bị thật

1. Cài đặt **Expo Go** từ App Store / Google Play
2. Quét QR code từ terminal sau khi chạy `npm start`

---

## 🔑 Biến môi trường

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `API_BASE_URL` | ✅ | URL của backend API server |

Biến môi trường được load thông qua `dotenv` trong `app.config.ts` và truy cập qua `expo-constants`.

---

## 📜 Scripts

| Script | Mô tả |
|--------|--------|
| `npm start` | Khởi động Expo dev server |
| `npm run android` | Chạy trên Android emulator/device |
| `npm run ios` | Chạy trên iOS simulator/device |
| `npm run web` | Chạy trên trình duyệt web |
| `npm run lint` | Kiểm tra code style với ESLint |
| `npm run reset-project` | Reset project về trạng thái ban đầu |

---

## 🔒 Bảo mật

- **Token Storage**: Access token & refresh token được lưu trữ an toàn thông qua `expo-secure-store` (Keychain trên iOS, Encrypted SharedPreferences trên Android).
- **Auto Refresh**: Hệ thống tự động refresh access token khi hết hạn, sử dụng cơ chế queue để tránh race condition khi nhiều request đồng thời bị 401.
- **Route Guard**: Middleware bảo vệ routes theo vai trò, tự động redirect nếu truy cập trái phép.

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m "feat: mô tả tính năng"`
4. Push to branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

### Quy ước commit message

```
feat:     Tính năng mới
fix:      Sửa lỗi
docs:     Cập nhật tài liệu
style:    Thay đổi style (không ảnh hưởng logic)
refactor: Tái cấu trúc code
perf:     Cải thiện hiệu suất
test:     Thêm/sửa test
chore:    Công việc bảo trì
```

---

## 👤 Tác giả

**Son Phan** — [@pnson1322](https://github.com/pnson1322)

---

<p align="center">
  Made with ❤️ using React Native & Expo
</p>
