document.addEventListener('DOMContentLoaded', () => {
  // ステップ画面エレメント
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const modalConfirm = document.getElementById('modal-confirm');
  const modalSuccess = document.getElementById('modal-success');

  // フォームエレメント
  const paperSizeSelect = document.getElementById('paper-size');
  const colorTypeSelect = document.getElementById('color-type');
  const copyCountInput = document.getElementById('copy-count');
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');

  // ボタンエレメント
  const goToStep2Btn = document.getElementById('go-to-step2');
  const backToStep1Btn = document.getElementById('back-to-step1');
  const createJobBtn = document.getElementById('create-print-job');
  const submitJobBtn = document.getElementById('btn-submit-job');
  const cancelJobBtn = document.getElementById('btn-cancel-job');
  const btnFinish = document.getElementById('btn-finish');

  // サイドバーナビゲーション
  const navItems = document.querySelectorAll('.sidebar-nav li');

  // ファイルアップロード
  const btnBrowse = document.getElementById('btn-browse');
  const fileInput = document.getElementById('file-input');
  const selectedFileName = document.getElementById('selected-file-name');

  // ポイント関連エレメント
  const userPointsEl = document.getElementById('user-points');
  const confirmCurrentPt = document.getElementById('confirm-current-pt');
  const confirmDetailLabel = document.getElementById('confirm-detail-label');
  const confirmCostPt = document.getElementById('confirm-cost-pt');
  const confirmResultPt = document.getElementById('confirm-result-pt');

  // ポイント設定
  const MAX_TOTAL_POINTS = 5000;
  let currentTotalPoints = 4800;

  // 初期設定
  let printSide = '片面';
  let location = '横浜';

  // 部数カウンター：1部より小さくならないようにする
  btnMinus.addEventListener('click', () => {
    const currentVal = Number.parseInt(copyCountInput.value, 10) || 1;

    if (currentVal > 1) {
      copyCountInput.value = currentVal - 1;
    }
  });

  // 部数を1部増やす
  btnPlus.addEventListener('click', () => {
    const currentVal = Number.parseInt(copyCountInput.value, 10) || 1;
    copyCountInput.value = currentVal + 1;
  });

  // 択一ボタン切り替え（印刷面・印刷場所）
  const setupToggleGroup = (groupId, callback) => {
    const group = document.getElementById(groupId);
    const buttons = group.querySelectorAll('.btn-toggle');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // すべてのボタンを未選択にする
        buttons.forEach((button) => {
          button.classList.remove('active');
          button.setAttribute('aria-pressed', 'false');
        });

        // クリックしたボタンを選択状態にする
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        callback(btn.getAttribute('data-value'));
      });
    });
  };

  // 印刷面の設定
  setupToggleGroup('print-side-group', (value) => {
    printSide = value;
  });

  // 印刷場所の設定
  setupToggleGroup('location-group', (value) => {
    location = value;
  });

  // Step 1 → Step 2：ファイル選択画面へ進む
  goToStep2Btn.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  });

  // Step 2 → Step 1：印刷設定画面へ戻る
  backToStep1Btn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
  });

  // ファイル選択ボタン
  btnBrowse.addEventListener('click', () => {
    fileInput.click();
  });

  // 選択したファイル名とサイズを表示
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const fileSize = (file.size / (1024 * 1024)).toFixed(2);
      selectedFileName.textContent = `${file.name}（${fileSize} MB）`;
    } else {
      selectedFileName.textContent = '';
    }
  });

  // Step 2 → Step 3：印刷確認モーダルを表示
  createJobBtn.addEventListener('click', () => {
    const paperSize = paperSizeSelect.value;
    const colorType = colorTypeSelect.value;
    const copies = Math.max(
      1,
      Number.parseInt(copyCountInput.value, 10) || 1
    );

    // 印刷ポイントを計算
    const unitCost = colorType === 'カラー' ? 100 : 50;
    const totalCost = unitCost * copies;
    const remainingAfter = currentTotalPoints - totalCost;

    // 確認モーダルに情報を表示
    confirmCurrentPt.textContent = `${currentTotalPoints}pt`;

    confirmDetailLabel.textContent =
      `消費ポイント（${colorType}/${printSide}/${paperSize}）`;

    confirmCostPt.textContent = totalCost;
    confirmResultPt.textContent = `${remainingAfter}pt`;

    // モーダルを表示
    modalConfirm.classList.remove('hidden');
  });

  // 印刷確認をキャンセル
  cancelJobBtn.addEventListener('click', () => {
    modalConfirm.classList.add('hidden');
  });

  // Step 3 → Step 4：アップロード完了
  submitJobBtn.addEventListener('click', () => {
    // ポイントを消費
    const cost = Number.parseInt(confirmCostPt.textContent, 10) || 50;
    currentTotalPoints -= cost;

    // 残りポイントを更新
    userPointsEl.textContent =
      `${currentTotalPoints}/${MAX_TOTAL_POINTS} pt`;

    // 確認モーダルを閉じ、完了モーダルを表示
    modalConfirm.classList.add('hidden');
    modalSuccess.classList.remove('hidden');
  });

  // アップロード完了後、元の画面に戻る
  const resetToStep1 = () => {
    // モーダルを閉じる
    modalSuccess.classList.add('hidden');
    modalConfirm.classList.add('hidden');

    // 印刷設定画面に戻る
    step2.classList.add('hidden');
    step1.classList.remove('hidden');

    // 選択したファイルをリセット
    selectedFileName.textContent = '';
    fileInput.value = '';

    // サイドバーの「印刷」を選択状態にする
    navItems.forEach((item) => {
      item.classList.remove('active');
    });

    document.getElementById('nav-print').classList.add('active');
  };

  // 「元の画面に戻る」ボタン
  btnFinish.addEventListener('click', resetToStep1);
});