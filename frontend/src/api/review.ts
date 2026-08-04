import type { ReviewRequest, ReviewResponse } from '../types/review';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function reviewCode(request: ReviewRequest): Promise<ReviewResponse> {
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await axios.post<ReviewResponse>(`${API_BASE_URL}/api/review`, request, { headers });
    // レスポンス例
    // const response = {
    //     "data":{
    //         "overall_evaluation": "基本的な動作に問題はありませんが、プログラムの再利用性や本番環境での運用性を高めるためのベストプラクティスが適用されていません。",
    //         "issues": [
    //             "スクリプトが他のモジュールからインポートされた際にも、意図せずグローバルスコープのコードが即座に実行されてしまいます。",
    //             "標準出力（print）を直接使用しているため、将来的なログ管理や出力レベルの制御（デバッグ、情報、警告など）が困難です。"
    //         ],
    //         "improvements": [
    //             "if __name__ == '__main__': ブロックを導入して、スクリプトのエントリポイントを明確にします。",
    //             "処理を関数にカプセル化し、コードの再利用性とテスト容易性を向上させます。",
    //             "標準の logging モジュールを使用し、出力の柔軟性を高めます。"
    //         ],
    //         "suggested_fixes": "import logging\n\nlogging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')\n\ndef greet(message: str = \"hello\") -> None:\n    \"\"\"指定されたメッセージをログ出力します。\"\"\"\n    logging.info(message)\n\nif __name__ == \"__main__\":\n    greet()",
    //         "learning_points": [
    //             "Pythonにおけるエントリーポイント（__name__ == '__main__'）の役割と、インポート時の動作制御の重要性。",
    //             "プロダクションコードにおいて、単純な print ではなく logging ライブラリを採用すべき理由とメリット。"
    //         ]
    // }}
    return response.data;
}