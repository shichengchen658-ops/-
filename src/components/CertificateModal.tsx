import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, Share2, Sparkles, X, CheckCircle, RefreshCw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  onClose: () => void;
  onRestart: () => void;
  onBackHome: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  score,
  stars,
  onClose,
  onRestart,
  onBackHome,
}) => {
  const [studentName, setStudentName] = useState('三年二班 智慧之星');
  const [isExporting, setIsExporting] = useState(false);
  const [hasClaimedAward, setHasClaimedAward] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playCheer();
      // Trigger joyful confetti shower
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#10b981', '#38bdf8', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Render certificate to high-res canvas and trigger download
  const handleDownload = () => {
    setIsExporting(true);
    sound.playPop();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas resolution: 1200 x 840 (high-res for printing)
    canvas.width = 1200;
    canvas.height = 840;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGrad.addColorStop(0, '#f0fdf4');
    bgGrad.addColorStop(0.5, '#f8fafc');
    bgGrad.addColorStop(1, '#ecfdf5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 840);

    // Decorative double border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 1140, 780);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 750);

    // Corner decorative flourishes
    const drawFlourish = (x: number, y: number) => {
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawFlourish(45, 45);
    drawFlourish(1155, 45);
    drawFlourish(45, 795);
    drawFlourish(1155, 795);

    // Institution / Subtitle
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('厦门筼筜湖生态文明科普实践', 600, 110);

    // Title
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('【筼筜湖生态小卫士】荣誉证书', 600, 185);

    // Decorative line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(350, 215);
    ctx.lineTo(850, 215);
    ctx.stroke();

    // Student Name
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(studentName || '三年级 小朋友', 600, 300);

    // Congratulatory statement
    ctx.fillStyle = '#334155';
    ctx.font = '24px sans-serif';
    ctx.fillText('在小学三年级科学《食物链大挑战》探索中表现卓越：', 600, 360);

    ctx.fillStyle = '#475569';
    ctx.font = '22px sans-serif';
    ctx.fillText('深刻理解了红树林湿地中“绿藻 ➔ 水蚤 ➔ 鱼虾 ➔ 白鹭”的捕食脉络，', 600, 420);
    ctx.fillText('能够精准辨识有害塑料垃圾，掌握了维护湿地生物多样性的宝贵知识，', 600, 460);
    ctx.fillText('特授予“筼筜湖生态小卫士”荣誉称号！', 600, 500);

    // Score & Stars Box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(400, 540, 400, 90, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 30px sans-serif';
    const starString = '⭐ '.repeat(Math.min(stars, 3));
    ctx.fillText(`${starString}  得分：${score} 分`, 600, 595);

    // Signatures & Official Stamp
    ctx.fillStyle = '#64748b';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`颁发日期：${dateStr}`, 150, 720);

    ctx.textAlign = 'right';
    ctx.fillText('认证机构：厦门筼筜湖少儿生态科教中心', 1050, 720);

    // Red Official Seal Stamp (Circle)
    ctx.save();
    ctx.translate(960, 680);
    ctx.strokeStyle = '#dc2626';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 筼筜生态 ★', 0, -10);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('认证专用章', 0, 16);
    ctx.restore();

    // Trigger download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `筼筜湖生态小卫士奖状_${studentName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsExporting(false);
      setHasClaimedAward(true);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-emerald-300 p-6 md:p-8 overflow-hidden text-center">
        {/* Close X button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="关闭"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hidden high-res canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Top Badge */}
        <div className="mx-auto w-16 h-16 -mt-3 mb-3 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-3xl shadow-lg border-2 border-white">
          🏆
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold font-kuaile text-emerald-950 mb-1">
          恭喜通关！荣获【筼筜湖生态小卫士】
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          你成功帮小动物们吃到了健康食物，守护了美丽的筼筜湿地！
        </p>

        {/* Certificate Preview Card */}
        <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-200 shadow-inner mb-6 text-slate-800">
          <div className="text-xs font-bold text-emerald-700 tracking-wider mb-2">
            XIAMEN YUNDANG LAKE ECO-GUARDIAN AWARD
          </div>

          <div className="mb-4">
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">
              ✏️ 请输入获奖同学姓名 / 班级：
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="px-4 py-2 text-center text-lg md:text-xl font-bold text-emerald-900 bg-white border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 shadow-sm w-full max-w-xs"
              placeholder="例如：三年二班 林晓鹭"
              maxLength={20}
            />
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-4">
            熟练掌握了白鹭、弹涂鱼、招潮蟹等小生物的“食物链”关系，不乱丢塑料垃圾，保护家乡水质与鸟类栖息地。
          </p>

          <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-white/90 rounded-2xl border border-emerald-200 shadow-sm text-sm">
            <span className="font-bold text-amber-500 flex items-center gap-1">
              {'⭐'.repeat(Math.min(stars, 3))}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-emerald-800">总得分：{score} 分</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">{dateStr}</span>
          </div>

          {hasClaimedAward && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>奖状已成功领取并保存！</span>
            </div>
          )}
        </div>

        {/* Action Buttons: 领完奖状后支持返回主页 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>
              {isExporting
                ? '正在生成奖状...'
                : hasClaimedAward
                ? '再次下载奖状 (PNG)'
                : '保存 / 下载荣誉奖状 (PNG)'}
            </span>
          </button>

          {/* 领完1个奖状后显示“返回主页”，点击后回到主页 */}
          {hasClaimedAward ? (
            <button
              onClick={() => {
                sound.playPop();
                onBackHome();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span>返回主页</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                onBackHome();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span>返回主页</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
