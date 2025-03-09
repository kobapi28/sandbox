"use client"

import Editor from "@/features/editor"
import { useEffect } from "react"
import { decompressFromEncodedURIComponent } from "lz-string"

export default function Home() {
  // 初期アクセス時にURLのハッシュを処理
  useEffect(() => {
    const hash = window.location.hash.slice(1)

    // ハッシュが存在する場合
    if (hash) {
      try {
        // ハッシュが有効な圧縮データかどうかを確認
        const decompressed = decompressFromEncodedURIComponent(hash)

        // 有効な圧縮データの場合は、JSONとしてパースできるはず
        if (decompressed) {
          const data = JSON.parse(decompressed)

          // html, css, jsプロパティが存在するかチェック
          if (data && (data.html !== undefined || data.css !== undefined || data.js !== undefined)) {
            // 有効な共有リンクなので、ハッシュを保持する（何もしない）
            return
          }
        }
      } catch (error) {
        // パースエラーの場合は、無効なハッシュと判断
        console.error("Invalid hash in URL:", error)
        // 無効なハッシュなので削除
        window.history.replaceState(null, "", window.location.pathname)
      }
    }
  }, [])

  return <Editor />
}

