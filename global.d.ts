declare namespace NodeJS {
  // 環境変数名の定義
  interface ProcessEnv {
    CDK_DEFAULT_ACCOUNT: string
    CDK_DEFAULT_REGION: string
  }
}
