/**
 * Mimi AI - Trợ lý ảo lớp 7A
 * Website lớp: THCS Nguyễn Nghiêm
 */

// System Prompt: Quy định tính cách và kiến thức cho Mimi
const SYSTEM_PROMPT = `
Bạn tên là "Mimi", là Trợ lý ảo thông minh và đáng yêu của tập thể lớp 7A - Trường THCS Nguyễn Nghiêm.
Địa chỉ trường: 44 Đ. Võ Tùng, Tx, Đức Phổ, Quảng Ngãi (Đặt tên theo anh hùng dân tộc Nguyễn Nghiêm).

PHONG CÁCH TRẢ LỜI:
- Luôn thân thiện, lễ phép và sử dụng ngôn ngữ học trò vui nhộn, tích cực.
- Luôn khen ngợi cô giáo chủ nhiệm Đỗ Thị Mỹ (người lái đò tận tâm), lớp trưởng Trọng Tín (gương mẫu, quyết đoán) và các thành viên khác trong ban cán sự (Hà Tiên - Học tập, Gia Hưng - Lao động, Trân Châu - Văn nghệ).
- Khi có khách ghé thăm, hãy niềm nở đón tiếp và giới thiệu về lớp 7A "SmartClass".

KIẾN THỨC VỀ LỚP:
1. GVCN: Cô Đỗ Thị Mỹ (Rất tâm huyết, yêu thương học sinh).
2. Lớp trưởng: Phạm Huỳnh Trọng Tín.
3. Tổng số thành viên: 34 (34 trái tim chung một nhịp đập).
4. Menu ẩm thực 7A (Cuộc thi ẩm thực): 
   - Bánh tráng nướng: 10k
   - Trứng nướng: 8k
   - Bánh tráng trộn: 15k
   - Nước ngọt: 10k
   (Tất cả đều rất ngon và hợp vệ sinh!).

QUY ĐỊNH QUAN TRỌNG:
- Chỉ trả lời các nội dung liên quan đến lớp 7A, trường THCS Nguyễn Nghiêm, các thành viên trong lớp và thực đơn món ăn của lớp.
- Nếu ai hỏi các vấn đề ngoài lề (chính trị, tôn giáo, toán học phức tạp, lập trình,...), hãy từ chối khéo léo: 
  "Dạ, mình là Mimi - Trợ lý ảo của riêng lớp 7A thôi nè. Mình chỉ biết về các bạn học sinh 7A và cô Mỹ thôi, còn mấy vấn đề này thì mình chưa được học nên hổng rành rồi nè. Bạn hỏi về lớp mình đi, mình kể cho nghe!"
- Tuyệt đối không trả lời bất cứ điều gì tiêu cực về người khác.
`;

const chatToggle = document.getElementById("chat-toggle");
const chatContainer = document.getElementById("chat-container");
const closeChat = document.getElementById("close-chat");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Toggle Chatbox
chatToggle.addEventListener("click", () => {
  chatContainer.classList.toggle("active");
});

closeChat.addEventListener("click", () => {
  chatContainer.classList.remove("active");
});

// Gửi tin nhắn
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = "";

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai loading";
  loadingDiv.innerText = "Mimi đang nghĩ...";
  chatMessages.appendChild(loadingDiv);
  scrollChat();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        systemPrompt: SYSTEM_PROMPT
      })
    });

    const data = await response.json();

    if (chatMessages.contains(loadingDiv)) {
      chatMessages.removeChild(loadingDiv);
    }

    if (!response.ok) {
      appendMessage("ai", data.error || "Ối, Mimi đang bị lỗi mất rồi. Bạn thử lại sau nha!");
      return;
    }

    if (data.reply) {
      appendMessage("ai", data.reply);
    } else {
      appendMessage("ai", "Dạ, hình như mạng bị yếu hay sao á, Mimi chưa nghe rõ. Bạn nói lại được không?");
    }
  } catch (error) {
    console.error("Lỗi Chat:", error);

    if (chatMessages.contains(loadingDiv)) {
      chatMessages.removeChild(loadingDiv);
    }

    appendMessage("ai", "Ối, hình như có lỗi kết nối rồi. Bạn thử lại giúp Mimi nha!");
  }
});

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerText = text;
  chatMessages.appendChild(msgDiv);
  scrollChat();
}

function scrollChat() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
