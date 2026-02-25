const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// 🔥 QUAN TRỌNG: dùng PORT của Render
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: true,
        message: "API Check Info TikTok hoạt động"
    });
});

app.get("/api/tiktok", async (req, res) => {
    const username = req.query.user;

    if (!username) {
        return res.json({
            status: false,
            message: "Thiếu username"
        });
    }

    try {
        const url = `https://www.tiktok.com/api/user/detail/?uniqueId=${username}`;

        const { data } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
                "Accept": "application/json",
                "Referer": "https://www.tiktok.com/"
            },
            timeout: 15000
        });

        if (!data.userInfo) {
            return res.json({
                status: false,
                message: "Không tìm thấy user hoặc bị block"
            });
        }

        const user = data.userInfo.user;
        const stats = data.userInfo.stats;

        res.json({
            status: true,
            username: user.uniqueId,
            nickname: user.nickname,
            bio: user.signature,
            followers: stats.followerCount,
            following: stats.followingCount,
            likes: stats.heartCount,
            videos: stats.videoCount,
            avatar: user.avatarLarger,
            verified: user.verified
        });

    } catch (err) {
        res.json({
            status: false,
            message: "TikTok chặn IP hoặc user không tồn tại"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server chạy tại port ${PORT}`);
});
