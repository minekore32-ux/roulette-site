# Roulette Site (Firebase + Admin Auth)

起動とセットアップ手順（簡潔）

1. ローカルサーバで起動（ES module を使うため）

```bash
python -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

2. Firebase セットアップ（コンソールで）
- Firebase プロジェクトを作成
- Authentication > Sign-in method で Email/Password を有効化
- Realtime Database を作成
- Realtime Database のルールを開発中は下記のように一時的に許可できます（本番では必ずルールを厳しくしてください）:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. `firebase.js` の `firebaseConfig` をあなたのプロジェクト値に置き換え、`ADMIN_EMAILS` に管理者メールを追加してください。

4. 管理者ユーザーを Authentication で作成（メール/パスワード）。そのメールを `ADMIN_EMAILS` に登録します。

5. ブラウザで管理画面にログインして編集・保存を確認します。
