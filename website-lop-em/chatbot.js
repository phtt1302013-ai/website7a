/**
 * Nghiêm Nghiêm AI - Trợ lý ảo lớp 7A
 * Website lớp: THCS Nguyễn Nghiêm
 */

// LƯU Ý: Thay API Key của bạn vào đây để chatbot hoạt động
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System Prompt: Quy định tính cách và kiến thức cho Nghiêm Nghiêm
const SYSTEM_PROMPT = `
Bạn tên là "Nghiêm Nghiêm", là Trợ lý ảo thông minh và đáng yêu của tập thể lớp 7A - Trường THCS Nguyễn Nghiêm.
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
  "Dạ, mình là Nghiêm Nghiêm - Trợ lý ảo của riêng lớp 7A thôi nè. Mình chỉ biết về các bạn học sinh 7A và cô Mỹ thôi, còn mấy vấn đề này thì mình chưa được học nên hổng rành rồi nè. Bạn hỏi về lớp mình đi, mình kể cho nghe!"
- Tuyệt đối không trả lời bất cứ điều gì tiêu cực về người khác.
`;

const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Toggle Chatbox
chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('active');
});

closeChat.addEventListener('click', () => {
    chatContainer.classList.remove('active');
});

// Gửi tin nhắn
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    // Hiển thị tin nhắn người dùng
    appendMessage('user', message);
    chatInput.value = '';

    // Hiển thị trạng thái đang trả lời
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai loading';
    loadingDiv.innerText = 'Nghiêm Nghiêm đang nghĩ...';
    chatMessages.appendChild(loadingDiv);
    scrollChat();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: SYSTEM_PROMPT + "\n\nCÂU HỎI CỦA NGƯỜI DÙNG: " + message }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        chatMessages.removeChild(loadingDiv);

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiText = data.candidates[0].content.parts[0].text;
            appendMessage('ai', aiText);
        } else {
            appendMessage('ai', 'Dạ, hình như mạng bị yếu hay sao á, Nghiêm Nghiêm chưa nghe rõ. Bạn nói lại được không?');
        }
    } catch (error) {
        console.error("Lỗi Chat:", error);
        chatMessages.removeChild(loadingDiv);
        appendMessage('ai', 'Ối, hình như có lỗi gì rồi. Bạn kiểm tra lại API Key xem sao nhé!');
    }
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    scrollChat();
}

function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
