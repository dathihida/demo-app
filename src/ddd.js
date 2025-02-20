import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";

const linearRegression = (temp, humidity, rain) => {
  const intercept = 10;
  const tempCoef = -0.6;
  const humidityCoef = 0.4;
  const rainCoef = 0.5;
  return intercept + (tempCoef * temp) + (humidityCoef * humidity) + (rainCoef * rain);
};

const predictFluRisk = (temp, humidity, rain, healthStatus, age, history) => {
  let baseRisk = linearRegression(temp, humidity, rain);
  
  const riskKeywords = [
    "mệt", "sốt", "ho", "đau họng", "cảm lạnh", "viêm họng", "đau đầu", "khó thở", "ớn lạnh",
    "đau người", "sổ mũi", "chóng mặt", "mất vị giác", "đau cơ", "đau khớp", "không khỏe", "hắt hơi",
    "đau bụng", "ngạt mũi", "ngứa họng", "đau tai"
  ];
  const healthyKeywords = [
    "khỏe", "bình thường", "tốt", "cảm thấy ổn", "không vấn đề gì", "không có triệu chứng", "rất khỏe",
    "ổn định", "không bị ốm", "cảm thấy khỏe", "đủ sức khỏe"
  ];
  
  let healthScore = 0;
  riskKeywords.forEach(word => {
    if (new RegExp(`\\b${word}\\b`, "i").test(healthStatus)) healthScore += 18;
  });
  healthyKeywords.forEach(word => {
    if (new RegExp(`\\b${word}\\b`, "i").test(healthStatus)) healthScore -= 15;
  });

  if (age > 60) baseRisk += 10;
  if (age < 10) baseRisk += 8;
  if (history.toLowerCase().includes("hen suyễn") || history.toLowerCase().includes("tiểu đường")) baseRisk += 15;
  if (history.toLowerCase().includes("không có tiền sử")) baseRisk -= 5;

  baseRisk += healthScore;
  return Math.min(100, Math.max(0, Math.round(baseRisk)));
};

export default function FluTrendApp() {
  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState(80);
  const [rain, setRain] = useState(30);
  const [healthStatus, setHealthStatus] = useState("");
  const [age, setAge] = useState(30);
  const [history, setHistory] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePredict = () => {
    if (!healthStatus.trim() || !history.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin sức khỏe!");
      return;
    }
    setPrediction(predictFluRisk(temp, humidity, rain, healthStatus, age, history));
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value === "" ? "" : Number(value));
  };

  const healthMessages = [
    "Hôm nay trời lạnh, hãy giữ ấm nhé!",
    "Đừng quên uống nước và nghỉ ngơi đầy đủ!",
    "Giữ tinh thần thoải mái để tăng cường sức đề kháng!",
    "Hãy chăm sóc sức khỏe, ăn uống đầy đủ chất dinh dưỡng!",
    "Đừng quên vận động nhẹ để cơ thể luôn khỏe mạnh!"
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen text-white">
      <h1 className="text-2xl font-bold text-center">Dự đoán khả năng mắc bệnh cúm</h1>
      <Card className="mt-6 bg-white p-4 rounded-lg shadow-lg text-black">
        <CardContent>
          <div className="mb-3">
            <label className="font-semibold">Bạn cảm thấy thế nào hôm nay? Bạn có hay mắc bệnh cúm không?</label>
            <input type="text" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)} className="ml-2 p-2 border w-full rounded-md" />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Tuổi của bạn: </label>
            <input type="number" value={age} onChange={handleInputChange(setAge)} className="ml-2 p-2 border rounded-md" />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Tiền sử bệnh lý (nếu có): </label>
            <input type="text" value={history} onChange={(e) => setHistory(e.target.value)} className="ml-2 p-2 border w-full rounded-md" />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Nhiệt độ (°C): </label>
            <input type="number" value={temp} onChange={handleInputChange(setTemp)} className="ml-2 p-2 border rounded-md" />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Độ ẩm (%): </label>
            <input type="number" value={humidity} onChange={handleInputChange(setHumidity)} className="ml-2 p-2 border rounded-md" />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Lượng mưa (mm): </label>
            <input type="number" value={rain} onChange={handleInputChange(setRain)} className="ml-2 p-2 border rounded-md" />
          </div>
          <button onClick={handlePredict} className="mt-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Dự đoán
          </button>
          {prediction !== null && (
            <p className="mt-3 text-lg font-bold transition-all duration-500 ease-in-out">
              Khả năng mắc bệnh: <span className="text-red-600">{prediction}%</span>
            </p>
          )}
          <p className="mt-3 text-md font-semibold">
            {healthMessages[Math.floor(Math.random() * healthMessages.length)]}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
