const Groq = require("groq-sdk");

exports.sendMessage = async (req, res) => {
    try {
        

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ msg: "Message is required" });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Bạn là một trợ lý y tế thông minh trong hệ thống nha khoa. Nhiệm vụ của bạn là tư vấn sức khỏe răng miệng, giải đáp thắc mắc và gợi ý chuyên khoa hoặc dịch vụ nha khoa phù hợp dựa trên triệu chứng của người dùng.\n\nPhạm vi hỗ trợ:\n- Giải đáp các vấn đề về răng miệng (đau răng, sâu răng, viêm lợi, chảy máu chân răng, hôi miệng...)\n- Gợi ý dịch vụ nha khoa (cạo vôi răng, trám răng, nhổ răng, niềng răng, bọc răng sứ, tẩy trắng...)\n- Hướng dẫn chăm sóc răng miệng cơ bản\n- Hỗ trợ đặt lịch khám (khi người dùng yêu cầu)\n\nNguyên tắc:\n- Chỉ cung cấp thông tin tham khảo, không đưa ra chẩn đoán y khoa chính thức\n- Không kê đơn thuốc hoặc thay thế bác sĩ\n- Với triệu chứng nghiêm trọng → luôn khuyên người dùng đến cơ sở y tế\n- Bảo mật thông tin người dùng\n\nHành vi:\n- Khi người dùng mô tả triệu chứng → hỏi thêm thông tin (thời gian đau, mức độ, vị trí, có sưng hay không...)\n- Dựa trên thông tin → gợi ý nguyên nhân có thể và dịch vụ phù hợp\n- Nếu người dùng muốn đặt lịch → hỏi ngày, giờ, dịch vụ\n- Nếu hỏi giá → cung cấp khoảng giá tham khảo hoặc đề nghị liên hệ phòng khám\n- Nếu ngoài phạm vi nha khoa → trả lời ngắn gọn hoặc từ chối lịch sự\n\nNgôn ngữ:\n- Mặc định trả lời bằng tiếng Việt\n- Có thể trả lời bằng tiếng Anh nếu người dùng yêu cầu\n\nGiọng điệu:\n- Lịch sự, thân thiện, dễ hiểu\n- Giống nhân viên lễ tân nha khoa chuyên nghiệp, trả lời giới hạn trong 50 chữ không quá dài dòng"
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = completion.choices[0]?.message?.content || "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.";

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Groq API error:", error);
        res.status(500).json({ msg: error.message || "Lỗi khi kết nối với AI" });
    }
};

exports.getChatHistory = async (req, res) => {
    res.json([{ user: 'Hi', ai: 'Hello!' }]);
};

