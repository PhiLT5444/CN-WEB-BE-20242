|**Mã Use case**|UC-001|**Tên Use case**|Thực hiện thanh toán|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Khách hàng|||
|**Mô tả**|Khách hàng thực hiện thanh toán cho đơn hàng trên website bán hàng.|||
|**Tiền điều kiện**|<p>Khách hàng đã đăng nhập thành công vào hệ thống.</p><p>Hệ thống hoạt động bình thường.</p>|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Khách hàng|Khách hàng truy cập vào phần thanh toán trên website và chọn thực hiện thanh toán.|
|2|Hệ thống|Hiển thị giao diện danh sách các phương thức thanh toán khả dụng.|
|3|Khách hàng|Khách hàng thực hiện "Chọn phương thức thanh toán".|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|3a|Khách hàng|Khách hàng hủy thanh toán.|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|Hệ thống chuyển giao diện sang “Chọn phương thức thanh toán”.|||



|**Mã Use case**|UC-002|**Tên Use case**|Chọn phương thức thanh toán|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Khách hàng|||
|**Mô tả**|Khách hàng chọn một phương thức thanh toán từ danh sách các phương thức khả dụng trên website bán hàng.|||
|**Tiền điều kiện**|<p>Khách hàng đã bắt đầu quy trình "Thực hiện thanh toán"</p><p>Hệ thống hoạt động bình thường.</p>|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Hệ thống|Hệ thống hiển thị danh sách các phương thức thanh toán khả dụng cho khách hàng.|
|2|Khách hàng|Khách hàng xem danh sách và chọn một phương thức thanh toán.|
|3|Hệ thống|Hệ thống kiểm tra tính hợp lệ của phương thức thanh toán đã chọn.|
|4|Hệ thống|Hệ thống ghi nhận phương thức thanh toán mà khách hàng đã chọn.|
|5|Hệ thống|Hệ thống thông báo cho khách hàng rằng phương thức thanh toán đã được chọn thành công.|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|2a|Khách hàng|Khách hàng không muốn tiếp tục và chọn hủy.|
|3a|Hệ thống|Thông báo: Phương thức thanh toán mà khách hàng chọn không hợp lệ (ví dụ: khách hàng chọn COD nhưng đơn hàng không hỗ trợ COD do giá trị đơn hàng quá lớn).|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|Hệ thống ghi nhận phương thức thanh toán mà khách hàng đã chọn, chuyển sang giao diện xác nhận thanh toán.|||

|**Mã Use case**|UC-003|**Tên Use case**|Xác nhận thanh toán|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Khách hàng|||
|**Mô tả**|Hệ thống xác nhận thông tin thanh toán của khách hàng trước khi gửi yêu cầu thanh toán đến Hệ thống thanh toán (Bên thứ ba).|||
|**Tiền điều kiện**|Khách hàng đã hoàn thành các bước trước đó trong quy trình "Thực hiện thanh toán"|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Hệ thống|Hệ thống hiển thị giao diện xác nhận thanh toán, bao gồm thông tin tóm tắt (phương thức thanh toán đã chọn, tổng tiền, v.v.) và nút "Xác nhận thanh toán".|
|2|Khách hàng|Khách hàng kiểm tra thông tin và nhấn nút "Xác nhận thanh toán" để đồng ý thực hiện giao dịch.|
|3|Hệ thống|Hệ thống kiểm tra tính hợp lệ của giao dịch.|
|4|Hệ thống|Hệ thống gửi yêu cầu thanh toán đến Hệ thống thanh toán (Bên thứ ba).|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|2a|Khách hàng|Khách hàng không muốn tiếp tục và chọn hủy.|
|4a|Hệ thống|Thông báo: Hệ thống không thể kết nối với Hệ thống thanh toán (Bên thứ ba).|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|Hệ thống đã gửi yêu cầu thanh toán thành công đến Hệ thống thanh toán (Bên thứ ba).|||



|**Mã Use case**|UC-004|**Tên Use case**|Xử lý thanh toán|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Hệ thống thanh toán (Bên thứ ba)|||
|**Mô tả**|Hệ thống thanh toán (Bên thứ ba) xử lý giao dịch thanh toán sau khi nhận được yêu cầu từ hệ thống website bán hàng.|||
|**Tiền điều kiện**|<p>Quy trình "Thực hiện thanh toán" (Use Case chính UC-001) đã đến bước "Xác nhận thanh toán" (UC-003).</p><p>Hệ thống hoạt động bình thường.</p>|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Bên thứ ba|Hệ thống thanh toán (Bên thứ ba) nhận yêu cầu thanh toán từ hệ thống website bán hàng.|
|2|Bên thứ ba|Hệ thống thanh toán kiểm tra tính hợp lệ của yêu cầu.|
|3|Bên thứ ba|Hệ thống thanh toán thực hiện giao dịch.|
|4|Bên thứ ba|Hệ thống thanh toán trả về kết quả giao dịch cho hệ thống website.|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1a|Bên thứ ba|Hệ thống thanh toán (Bên thứ ba) không phản hồi.|
|2a|Bên thứ ba|Thông báo: Giao dịch thất bại do tài khoản không đủ tiền.|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|Thanh toán thành công và chuyển đến giao diện tạo hóa đơn.|||



|**Mã Use case**|UC-005|**Tên Use case**|Tạo hóa đơn điện tử|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Hệ thống|||
|**Mô tả**|Hệ thống website bán hàng tự động tạo hóa đơn điện tử cho đơn hàng sau khi giao dịch thanh toán được xử lý thành công bởi Hệ thống thanh toán (Bên thứ ba)|||
|**Tiền điều kiện**|<p>Quy trình "Thực hiện thanh toán" (Use Case chính UC-001) đã đến bước "Xử lý thanh toán" (UC-004).</p><p>Hệ thống hoạt động bình thường.</p>|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Hệ thống|Hệ thống website nhận được kết quả giao dịch thành công từ Hệ thống thanh toán (Bên thứ ba).|
|2|Hệ thống|Hệ thống website thu thập thông tin cần thiết để tạo hóa đơn điện tử.|
|3|Hệ thống|Hệ thống website tạo hóa đơn điện tử dưới dạng tài liệu số|
|4|Hệ thống|Hệ thống website lưu trữ hóa đơn điện tử vào cơ sở dữ liệu để phục vụ tra cứu sau này.|
|5|Hệ thống|Hệ thống website thông báo cho khách hàng rằng hóa đơn điện tử đã được tạo và gửi thành công.|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|3a|Hệ thống|Thông báo lỗi: Lỗi khi tạo hóa đơn điện tử.|
|5a|Hệ thống|Thông báo lỗi: Không thể lưu thông tin vào cơ sở dữ liệu.|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|<p>Hóa đơn điện tử được tạo và lưu trữ trong cơ sở dữ liệu của hệ thống website.</p><p>Khách hàng nhận được thông báo hóa đơn được tạo.</p>|||



|**Mã Use case**|UC-006|**Tên Use case**|Xem hóa đơn|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Khách hàng|||
|**Mô tả**|Quá trình khách hàng xem thông tin hóa đơn của đơn hàng trên website bán hàng.|||
|**Tiền điều kiện**|<p>Khách hàng đã đăng nhập vào hệ thống website bán hàng.</p><p>Hệ thống website có thông tin đầy đủ về đơn hàng.</p><p>Hệ thống hoạt động bình thường.</p>|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Hệ thống|Hệ thống website hiển thị giao diện xem hóa đơn.|
|2|Hệ thống|Hệ thống website hiển thị thông tin hóa đơn chi tiết.|
|3|Khách hàng|Khách hàng kiểm tra thông tin hóa đơn.|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|2a|Hệ thống|Thông báo lỗi: Hóa đơn không tồn tại.|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|Chuyển về giao diện trang chủ.|||



|**Mã Use case**|UC-007|**Tên Use case**|Hủy thanh toán|
| :-: | :-: | :-: | :-: |
|**Tác nhân**|Khách hàng|||
|**Mô tả**|Khách hàng hủy giao dịch thanh toán|||
|**Tiền điều kiện**|<p>Khách hàng đang trong quy trình "Thực hiện thanh toán" (Use Case chính UC-001). </p><p>Khách hàng chưa hoàn tất giao dịch thanh toán (tức là Hệ thống thanh toán (Bên thứ ba) chưa xử lý giao dịch thành công trong Use Case "Xử lý thanh toán" UC-004). </p><p>Đơn hàng của khách hàng đang ở trạng thái "Chưa thanh toán". </p><p>Hệ thống website bán hàng đang hoạt động bình thường và có thể xử lý yêu cầu hủy thanh toán.</p>|||
|**Luồng sự kiện chính (Thành công)**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|1|Khách hàng|Khách hàng quyết định hủy thanh toán.|
|2|Hệ thống|Hệ thống website nhận yêu cầu hủy thanh toán từ khách hàng.|
|3|Hệ thống|Hệ thống website kiểm tra trạng thái đơn hàng để đảm bảo rằng giao dịch chưa được xử lý thành công.|
|4|Hệ thống|Hệ thống website cập nhật trạng thái đơn hàng thành "Chưa thanh toán".|
|5|Hệ thống|Hệ thống website thông báo cho khách hàng rằng thanh toán đã bị hủy.|
|6|Hệ thống|Hệ thống website ghi nhận sự kiện hủy thanh toán vào nhật ký hệ thống để phục vụ tra cứu sau này.|

|||||
| :-: | :-: | :- | :- |
|**Luồng sự kiện thay thế**||||

|**STT**|**Thực hiện bởi**|**Hành động**|
| :-: | :-: | :-: |
|3a|Hệ thống|Thông báo lỗi: Không thể hủy do bên thứ 3 đã giao dịch.|
|4a|Hệ thống|Thông báo lỗi: Hệ thống gặp lỗi khi cập nhật trạng thái đơn hàng.|

|||||
| :-: | :-: | :- | :- |
|**Hậu điều kiện**|<p>Đơn hàng được cập nhật trạng thái thành "Chưa thanh toán".</p><p>Thông báo thành công đến khách hàng và chuyển về giao diện trang chủ.</p>|||

