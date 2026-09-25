# BÁO CÁO KỸ THUẬT NGẮN MINI-PROJECT
**Học phần:** Phát triển ứng dụng di động đa nền tảng (VKU)  
**Tên Mini-Project:** Mini-Project 2: Real-time Study Room Booking App (Ứng dụng đặt phòng học tập)  
**Sinh viên thực hiện:** Trần Văn Pháp  
**Mã sinh viên:** 23IT.B161  
**Ngày nộp:** 25/09/2026  

---

## 1. THÔNG TIN CHUNG VÀ LIÊN KẾT SẢN PHẨM
* **Thành viên nhóm:**
  1. Trần Văn Pháp - 23IT.B161
* **🔗 Liên kết bản chạy thử:** [Expo Web / Demo Local / APK]
* **💻 Kho mã nguồn GitHub:** https://github.com/phap321/miniproject2
* **🎥 Video giới thiệu (tùy chọn):** [Link Video Demo]

---

## 2. DANH SÁCH KIỂM TRA TÍNH NĂNG
| # | Tính năng yêu cầu | Trạng thái | Chi tiết triển khai và mức độ đáp ứng |
|:---:|---|:---:|---|
| 1 | Tìm kiếm và lọc phòng học | ✅ Hoàn thành | Danh sách phòng mẫu với tên, tòa nhà, sức chứa và thông tin tiếng Việt. Tìm kiếm theo tên/mô tả và lọc đa tiêu chí (Khu vực tòa nhà, sức chứa tối thiểu, mức độ tiếng ồn `Silent`/`Quiet`/`Collaborative`, tiện ích). |
| 2 | Trạng thái đặt phòng và phiên người dùng dùng chung | ✅ Hoàn thành | Zustand (`useUserStore`, `useBookingStore`, `useFilterStore`) quản lý tập trung phiên làm việc sinh viên, lịch đặt phòng, trạng thái khung giờ và tiêu chí lọc. Màn hình Profile hiển thị Thẻ sinh viên kỹ thuật số. |
| 3 | Tối ưu hiển thị danh sách phòng (60fps) | ✅ Đã triển khai | `RoomsScreen` sử dụng `FlatList` tối ưu với `getItemLayout` (chiều cao cố định `ROOM_CARD_HEIGHT = 280`), `initialNumToRender={5}`, `maxToRenderPerBatch={8}`, `windowSize={5}`, `removeClippedSubviews`. Component `RoomCard` được bọc bằng `React.memo` kèm hàm so sánh props custom. |
| 4 | Ngăn xung đột khung giờ (Conflict Prevention) | ✅ Hoàn thành | Thuật toán `conflictChecker.ts` chuyển đổi thời gian sang phút để kiểm tra khoảng giao nhau `(s1 < e2 && e1 > s2)`. Từ chối đặt trùng khung giờ của phòng và từ chối các khung giờ trùng với lịch cá nhân của sinh viên; cho phép các khung giờ liền kề. Hủy đặt phòng giải phóng slot tức thì. |
| 5 | Thông báo đặt phòng cục bộ | ✅ Đã triển khai | Sử dụng `expo-notifications` trong `notificationService.ts`. Kiểm tra quyền thông báo, tự động gửi xác nhận và đặt lịch nhắc nhở trước giờ bắt đầu. Cho phép bật/tắt và tùy chỉnh thời gian nhắc (5m, 15m, 30m) ở màn hình Profile. |
| 6 | Quản lý lịch đặt phòng | ✅ Hoàn thành | Người dùng có thể tìm phòng, xem chi tiết, chọn khung giờ, xác nhận đặt phòng, xem danh sách lịch đã đặt (phân tab Active / History), hủy lịch đặt và mở **Thẻ vào cửa kỹ thuật số (Digital Access Pass / Mã QR)**. |

---

## 3. KIẾN TRÚC KỸ THUẬT VÀ CẤU TRÚC DỰ ÁN
Ứng dụng được xây dựng bằng **React Native**, **Expo SDK 57** và **TypeScript**. 

### Điều hướng (Navigation)
- **React Navigation** cung cấp điều hướng dạng Tab dưới (`BottomTabNavigator.tsx`) gồm 3 màn hình: Khám phá phòng (`RoomsScreen`), Lịch đã đặt (`MyBookingsScreen`) và Tài khoản (`ProfileScreen`).
- Sử dụng Native Stack Navigator (`AppNavigator.tsx`) để chuyển hướng mượt mà sang màn hình Chi tiết phòng (`RoomDetailScreen`).

### Quản lý Trạng thái (Zustand Stores)
Zustand chia sẻ trạng thái theo từng trách nhiệm rõ ràng trong thư mục `src/store/`:
* `useBookingStore.ts`: Quản lý danh sách phòng (`rooms`), lịch đặt phòng (`bookings`), thực hiện đặt chỗ (`bookRoomSlot`), hủy đặt chỗ (`cancelBooking`) và làm mới dữ liệu (`refreshRooms`).
* `useUserStore.ts`: Quản lý thông tin phiên sinh viên (`Trần Văn Pháp - 23IT.B161`), cài đặt thông báo (`notificationsEnabled`) và khoảng thời gian nhắc trước (`reminderLeadMinutes`).
* `useFilterStore.ts`: Quản lý từ khóa tìm kiếm (`searchQuery`), tòa nhà (`selectedBuilding`), sức chứa tối thiểu (`minCapacity`), mức tiếng ồn (`selectedNoiseLevel`), tiện ích (`selectedAmenities`) và ngày chọn (`selectedDate`).

### Cấu trúc thư mục mã nguồn
```
d:/Miniproject2/
├── App.tsx
├── package.json
├── README.md
└── src/
    ├── types/
    │   └── index.ts                 # Type definitions (StudyRoom, Booking, UserProfile, TimeSlot)
    ├── data/
    │   └── mockRooms.ts             # Dữ liệu phòng học và khung giờ mẫu trên Campus
    ├── utils/
    │   ├── conflictChecker.ts       # Thuật toán kiểm tra trùng lịch theo phút
    │   └── notificationService.ts   # Xử lý đăng ký & kích hoạt Expo Notifications
    ├── store/
    │   ├── useUserStore.ts          # Store phiên làm việc & cài đặt người dùng
    │   ├── useFilterStore.ts        # Store bộ lọc tìm kiếm
    │   └── useBookingStore.ts       # Store quản lý phòng & lịch đặt
    ├── components/
    │   ├── RoomCard.tsx             # Component thẻ phòng (Memoized 60fps)
    │   ├── RoomFilterBar.tsx        # Thanh lọc tòa nhà, tiếng ồn, sức chứa
    │   ├── TimeSlotGrid.tsx         # Lưới chọn khung giờ kèm cảnh báo xung đột
    │   └── ActiveBookingBanner.tsx  # Banner lịch đặt đang hoạt động
    ├── navigation/
    │   ├── types.ts                 # TypeScript navigation param list
    │   ├── BottomTabNavigator.tsx   # Thanh điều hướng Tab dưới
    │   └── AppNavigator.tsx         # Container Stack Navigation chính
    └── screens/
        ├── RoomsScreen.tsx          # Màn hình danh sách phòng (FlatList 60fps)
        ├── RoomDetailScreen.tsx      # Màn hình chi tiết phòng & chọn slot đặt
        ├── MyBookingsScreen.tsx      # Màn hình quản lý lịch đặt & Thẻ QR Pass
        └── ProfileScreen.tsx         # Màn hình Thẻ sinh viên & Cài đặt thông báo
```

---

## 4. MINH CHỨNG THỰC TẾ VÀ ẢNH CHỤP MÀN HÌNH
*(Thay thế bằng ảnh chụp màn hình thực tế từ trình duyệt/điện thoại của bạn)*

1. **Danh sách phòng & Bộ lọc:**
   ![Màn hình tìm phòng](/assets/screens/rooms_filter.png)  
   *Chú thích: Màn hình danh sách phòng với FlatList mượt mà, thanh tìm kiếm và bộ lọc nhanh theo tòa nhà/tiếng ồn.*

2. **Chi tiết phòng & Chọn khung giờ:**
   ![Màn hình chi tiết phòng](/assets/screens/room_detail.png)  
   *Chú thích: Giao diện chi tiết thông tin tiện ích, danh sách khung giờ với cảnh báo xung đột màu đỏ nếu trùng lịch cá nhân.*

3. **Xác nhận đặt phòng & Thẻ vào cửa QR Pass:**
   ![Thẻ QR Pass](/assets/screens/digital_pass.png)  
   *Chú thích: Thẻ vào cửa kỹ thuật số chứa mã QR giả lập để mở cửa phòng học.*

4. **Trang thông tin sinh viên & Cài đặt thông báo:**
   ![Thẻ sinh viên](/assets/screens/profile_screen.png)  
   *Chú thích: Thẻ sinh viên Trần Văn Pháp - 23IT.B161, bảng thống kê và cấu hình thông báo cục bộ.*

---

## 5. THÁCH THỨC KỸ THUẬT VÀ CÁCH GIẢI QUYẾT
1. **Ngăn đặt trùng khung giờ (Time-Slot Conflict Prevention):**
   - *Thách thức:* So sánh chuỗi thời gian trực tiếp (ví dụ `"09:00"`) dễ bị lỗi khi các khoảng thời gian đè lên nhau một phần hoặc giao nhau giữa lịch cá nhân và lịch phòng.
   - *Giải quyết:* Chuyển đổi giờ sang phút tính từ 00:00 (`timeToMinutes`) và kiểm tra điều kiện chồng chéo `s1 < e2 && e1 > s2`. Cho phép khoảng thời gian nối tiếp (ví dụ: slot trước kết thúc `10:00`, slot sau bắt đầu `10:00`).

2. **Tối ưu cuộn FlatList đạt 60fps:**
   - *Thách thức:* Render nhiều thẻ phòng với hình ảnh chất lượng cao và chip tiện ích có thể gây giật lag khi cuộn nhanh.
   - *Giải quyết:* Cố định chiều cao `ROOM_CARD_HEIGHT = 280`, triển khai `getItemLayout`, bọc `RoomCard` bằng `React.memo` kèm hàm kiểm tra sự thay đổi thuộc tính, đồng thời tinh chỉnh các thông số `initialNumToRender`, `maxToRenderPerBatch`, `windowSize` và `removeClippedSubviews`.

3. **Tương thích thông báo cục bộ trên Expo SDK 57:**
   - *Thách thức:* `expo-notifications` yêu cầu cấu hình handler đúng chuẩn theo phiên bản Expo mới nhất để không làm treo ứng dụng trên web hoặc simulator.
   - *Giải quyết:* Xây dựng lớp bọc `notificationService.ts` kiểm tra nền tảng (`Platform.OS`), xin quyền truy cập thông báo an toàn, bổ sung các thuộc tính `shouldShowBanner` và `shouldShowList`, đảm bảo ứng dụng hoạt động ổn định trên cả điện thoại lẫn trình duyệt web.
