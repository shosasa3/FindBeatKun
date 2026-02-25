/***********************************************************


	隠れビートくんをさがせ！
	FindBeatKun

	TODO
	- 長崎モード（一応OK）

	#横サイズでプレイする


***********************************************************/

//phina.js をグローバル領域に展開
phina.globalize();

//画面サイズ取得
let SCREEN_X = document.documentElement.clientWidth;
let SCREEN_Y = document.documentElement.clientHeight;
let SCREEN_X_RATIO = 1;
let SCREEN_Y_RATIO = 1;

let isPortrait;	//画面が縦向きか？

//画面サイズが縦長なら横のサイズにする
if( SCREEN_Y >= SCREEN_X ){
	SCREEN_X = 956;
	SCREEN_Y = 440;

}else{

	//画面サイズちょうどに迷彩を合わせるための係数
	SCREEN_X_RATIO = SCREEN_X / 956;
	SCREEN_Y_RATIO = SCREEN_Y / 440;
}

var DEBUG_FLG = false;	//デバッグフラグ


/******************************************

	アセット関連

******************************************/
//画像登録
var ASSETS = {
	//画像
	image: {
		'titleBG': './images/titleBG.jpg',		//タイトル背景
		'camo1': './images/1_1.png',			//迷彩_1
		'camo2': './images/2_1.png',			//迷彩_2
		'camo3': './images/3_1.png',			//迷彩_3
		'camo':  './images/all_camo.png',		//迷彩セット
		'beat':  './images/beat_all.png',		//ビート君セット
		'nagasaki': './images/nagasaki_all.png',	//長崎県セット
		'correct': './images/correct.png',		//正解の〇
		'incorrect': './images/incorrect.png',	//不正解の×
		'nikukyu': './images/nikukyu.png',		//肉球（ページ遷移に使用）
		'scratch': './images/scratch.png',		//爪痕（リザルトで使用）
		'modeUILeft': './images/ModeSelectLeft.png',
		'modeUIRight': './images/ModeSelectRight.png',

	},
	
	//サウンド
	sound: {
		correct: './sounds/correct.mp3',
		incorrect: './sounds/incorrect.mp3',
		start: './sounds/startButton.mp3',

	},
	
	//フォント
	font: {
    	DelaGothicOne: './fonts/DelaGothicOne-Regular.ttf',
  	},
};



/**********************************************************


	TitleScene class
	#タイトル画面


**********************************************************/
phina.define("TitleScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		let self = this;
		
		console.log( SCREEN_X );

		// 背景
		this.backgroundColor = '#2d5030';
		this.titleBG = Sprite('titleBG').addChildTo( this ).setPosition( this.gridX.center() , this.gridY.center() );
		this.titleBG.setScale( SCREEN_X_RATIO,SCREEN_Y_RATIO  );
		

		//モード選択テキスト
		this.modes = ['ビートくんモード', '長崎県モード'];
    	this.modeIndex = 0;

		//ゲームタイトル
		this.scoreLabel = Label({
			text: "ビートくんをさがせ！",
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.073,
			fill: 'white',
			stroke: "rgb(6, 57, 30)",
			strokeWidth: SCREEN_X * 0.0097,
			
		}).addChildTo( this ).setPosition( SCREEN_X * 0.5 , SCREEN_Y * 0.25 );

		//モード名（ビート君 or 長崎県 モード）
		this.modeLabel = Label({
			text: this.modes[ this.modeIndex ],
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.036,
			fill: 'white',
			stroke: "rgb(6, 57, 30)",
			strokeWidth : SCREEN_X * 0.006,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.5 , SCREEN_Y * 0.5 );

		//►（モード選択 右）
		/*
		this.scoreLabelRight = Label({
			text: "►",
			fontFamily: 'sans-serif',
			fontSize: SCREEN_X * 0.045,
			fill: 'white',
			stroke: "#06391e",
			strokeWidth : SCREEN_X * 0.006,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.7 , SCREEN_Y * 0.5 );
		this.scoreLabelRight.setInteractive( true );
		//►（モード選択 右）がクリックされたら
		this.scoreLabelRight.on('pointend', function() {
  			
			self.changeMode( 1 );

		});
		*/
		//モード選択 右（スプライトに変更）
		this.modeUIRight = Sprite('modeUIRight').addChildTo( this ).setPosition( SCREEN_X * 0.7 , SCREEN_Y * 0.5 );
		this.modeUIRight.setScale( SCREEN_X_RATIO,SCREEN_Y_RATIO  );
		this.modeUIRight.setInteractive( true );	//タッチを可能にする
		this.modeUIRight.onpointstart = function() {
			
			SoundManager.play('start');	//選択サウンド

			self.changeMode( 1 );
		};

		//◄（モード選択 左）
		/*
		this.scoreLabelLeft = Label({
			text: "◄",
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.045,
			fill: 'white',
			stroke: "rgb(6, 57, 30)",
			strokeWidth : SCREEN_X * 0.006,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.3 , SCREEN_Y * 0.5 );
		this.scoreLabelLeft.setInteractive( true );
		//◄（モード選択 左）がクリックされたら
		this.scoreLabelLeft.on('pointend', function() {

  			self.changeMode( -1 );
		
		});
		*/

		//モード選択 左（スプライトに変更）
		this.modeUILeft = Sprite('modeUILeft').addChildTo( this ).setPosition( SCREEN_X * 0.3 , SCREEN_Y * 0.5 );
		this.modeUILeft.setScale( SCREEN_X_RATIO,SCREEN_Y_RATIO  );
		this.modeUILeft.setInteractive( true );	//タッチを可能にする
		this.modeUILeft.onpointstart = function() {
			
			SoundManager.play('start');	//選択サウンド

			self.changeMode( 1 );
		};


		//"はじめる" ボタン
		this.startButton = Button({
			text : 'はじめる',
			fontFamily: 'DelaGothicOne',
			fill : '#ffffff',
			fontColor: '#2d5030',
			width: 200 * SCREEN_X_RATIO,
			height: 70 * SCREEN_Y_RATIO,
	
		}).addChildTo( this ).setPosition( SCREEN_X * 0.5 , SCREEN_Y * 0.75 );
		this.startButton.fontSize = this.startButton.width * 0.18;	//フォントサイズ 調整
		
		//"はじめる"ボタンが押されたら（ iPhone/iPad/PC全部対応しているはず.. ）
		this.startButton.onpointstart = function() {

			SoundManager.play('start');	//選択サウンド

			//メインシーンに遷移
			self.exit( "main" ,{ mode: self.modeIndex } );
		};

		
	}, //end init


	//更新処理
	update: function( app ) {


	}, //end update

	/*
		@class changeMode()
		#モード選択画面のテキストを変える

		@param {Number}dir ...1でプラス、-1でマイナスする
	*/
	changeMode: function( dir ) {

		this.modeIndex += dir;

		if ( this.modeIndex < 0 ) {
		this.modeIndex = this.modes.length - 1;
		}
		if (this.modeIndex >= this.modes.length) {
		this.modeIndex = 0;
		}

		this.modeLabel.text = this.modes[this.modeIndex];
  	},

}); //end TitleScene


/**********************************************************


	MainScene class
	#ゲームメイン


**********************************************************/
phina.define("MainScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		console.log( SCREEN_X_RATIO );

		// 背景色
		this.backgroundColor = '#bbb104';

		// 状態管理（チュートリアル -> カウントダウン -> ゲームプレイ）
		this.state = 'tutorial'	//'tutorial'、'countdown'、'playing'、'timeup'
		
		// モード選択
		this.modeIndex = param.mode;

		let self = this;	//thisを参照しておく

		/**
		 *  チュートリアル関連
		 */
		//this.isPlaying = false;
		
		/**
		 * スプライト関連
		**/
		//迷彩１( #436f24 )
		this.camo1 = Sprite('camo',956,440).addChildTo( this );
		this.camo1.x = this.gridX.center();
		this.camo1.y = this.gridY.center();
		this.camo1.frameIndex = 0;
		this.camo1.setScale( SCREEN_X_RATIO,SCREEN_Y_RATIO );	//画面に迷彩を合わせる
		
		//迷彩２( #42a15f )
		this.camo2 = Sprite('camo',956,440).addChildTo( this );
		this.camo2.x = this.gridX.center();
		this.camo2.y = this.gridY.center();
		this.camo2.frameIndex = 5;
		this.camo2.setScale( SCREEN_X_RATIO,SCREEN_Y_RATIO );	//画面に迷彩を合わせる

		//迷彩３( #182b1b )
		this.camo3 = Sprite('camo',956,440).addChildTo( this );
		this.camo3.x = this.gridX.center();
		this.camo3.y = this.gridY.center();
		this.camo3.frameIndex = 10;
		this.camo3.setScale( SCREEN_X_RATIO,SCREEN_Y_RATIO );	//画面に迷彩を合わせる

		//カウントダウン関連
		this.count = 3;
		this.countLabel = Label({
			text: '',
			fontFamily: 'DelaGothicOne',
			fill: 'white',
			fontSize: SCREEN_X * 0.08,
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.008,

		})
		.addChildTo( this )
		.setPosition( this.gridX.center(), this.gridY.center() )
		.hide();
		

		//ビート君（or 長崎県）
		if( this.modeIndex === 0 )	//モードによって画像を変える
		{
			//ビート君
			this.beat = Sprite('beat',187,187).addChildTo( this ).setPosition( Random.randfloat( SCREEN_X * 0.3, SCREEN_X * 0.7 ), Random.randfloat( SCREEN_Y * 0.4, SCREEN_Y * 0.7 )).hide();
		}
		else
		{
			//長崎県
			this.beat = Sprite('nagasaki',187,187).addChildTo( this ).setPosition( Random.randfloat( SCREEN_X * 0.3, SCREEN_X * 0.7 ), Random.randfloat( SCREEN_Y * 0.4, SCREEN_Y * 0.7 )).hide();
		}
		this.beat.frameIndex = 0;
		this.b_ratio = ( SCREEN_X * 0.12 ) / 187;			//ビート君の画像のサイズで割って係数を出す
		this.beat.setScale( this.b_ratio,this.b_ratio );	//画面サイズに調整する
		this.beat.setInteractive( true );	//タッチを可能にする
		const TOUCH_WAITING = 0
		const TOUCH_SUCCESS = 1;
		const TOUCH_FALSE 	= 2;
		this.beatTouchFlg = TOUCH_WAITING;

		//間違った場合、正解のビート君の場所を提示するテキスト
		this.beatTouchLabel = Label({
			text: "ここにいたよ！",
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.03,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.004,

		}).addChildTo( this );
		this.beatTouchLabel.hide();
		this.beatTouchLabel.tweener.clear();

		//正解 "〇" スプライト
		this.correct = Sprite('correct').addChildTo( this );
		this.correct.hide();

		//不正解 "×" スプライト
		this.incorrect = Sprite('incorrect').addChildTo( this );
		this.incorrect.hide();

		/**
		 * タイマー関連
		**/
		this.MAXTIME  = 60000;	//制限時間 ミリ秒で
		this.TIME_ON  = 1;
		this.TIME_UP  = 2;
		this.TIME_OFF = 3;

		this.timeFlg = this.TIME_ON;	//タイマー制御フラグ

		this.startTime = 0;	//経過時間によって制限時間をプラスするための開始時間

		//タイマーラベル
		this.time = this.MAXTIME; //タイマー（ミリ秒）
		this.timeLabel = Label({
			text: this.time,
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.04,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.005,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.8 , SCREEN_Y * 0.13 )
		.hide();

		//タイマープラスラベル
		this.timePlusLabel = Label({
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.035,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.005,

		}).addChildTo( this );
		this.timePlusLabel.hide();

		//タイムアップラベル
		this.timeUpLabel = Label({
			text: "タイムアップ！",
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.08,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.005,

		}).addChildTo( this ).setPosition( this.gridX.center() + ( SCREEN_X * 0.42 ), this.gridY.center() );
		this.timeUpLabel.hide();

		/**
		 *スコア関連 
		**/
		this.score = 0;
		this.scoreLabel = Label({
			text: this.score,
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.04,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.005,
			
		}).addChildTo( this ).setPosition( SCREEN_X * 0.5 , SCREEN_Y * 0.13 )
		.hide();

		/**
		 *肉球遷移アニメーション関連
		**/
		this.NIKYU_DATA = [
			{x: SCREEN_X * 0.2, y: SCREEN_Y * 0.3, scale: 0.5, wait:200},
  			{x: SCREEN_X * 0.5, y: SCREEN_Y * 0.5, scale: 0.8, wait:200},
  			{x: SCREEN_X * 0.2, y: SCREEN_Y * 0.1, scale: 1.0, wait:100},
			{x: SCREEN_X * 0.85, y: SCREEN_Y * 0.8, scale: 1.5, wait:100},
			{x: SCREEN_X * 0.2, y: SCREEN_Y * 0.75, scale: 2.0, wait:100},
			{x: SCREEN_X * 0.8, y: SCREEN_Y * 0.8, scale: 2.5, wait:100},
			{x: SCREEN_X * 0.8, y: SCREEN_Y * 0.2, scale: 2.5, wait:80},
			{x: SCREEN_X * 0.8, y: SCREEN_Y * 0.8, scale: 2.5, wait:80},
			{x: SCREEN_X * 0.2, y: SCREEN_Y * 0.2, scale: 2.5, wait:80},
			{x: SCREEN_X * 0.8, y: SCREEN_Y * 0.8, scale: 2.5, wait:80},
			{x: SCREEN_X * 0.3, y: SCREEN_Y * 0.4, scale: 3.0, wait:80},
			{x: SCREEN_X * 0.1, y: SCREEN_Y * 0.05, scale: 3.0, wait:80},
			{x: SCREEN_X * 0.5, y: SCREEN_Y * 0.5, scale: 3.0, wait:500},

		];
		this.nikukyuIndex = 0;
		
		
		//もしビート君をタッチしたら
		this.beat.onpointstart = function() {
			
			if ( self.state !== 'playing' ) return; // ゲーム中以外はゲーム動作しない
			
			if( self.beatTouchFlg === TOUCH_WAITING )	//２重でタッチできないようにする
			{
				SoundManager.play('correct');	//正解サウンド

				self.beatTouchFlg = TOUCH_SUCCESS;	//ビート君タッチフラグ成功
				
				/*
					ビート君を見つけるまでの経過時間によって制限時間をプラスする
				*/
				let t = ( Date.now() - self.startTime ) / 1000; // 秒に変換
				let plus = self.calculatePlusTimeByTime( t );	//経過時間によってプラス時間を決定
				
				//正解〇 演出
				self.correct.x = self.beat.x;
				self.correct.y = self.beat.y;
				self.correct.setScale( self.beat.scaleX,self.beat.scaleY );
				self.correct.show();
				self.correct.tweener //正解〇 アニメーション開始
					.to({
						scaleX: self.beat.scaleX + 0.2,
						scaleY: self.beat.scaleY + 0.2,

					},20,"swing" )
					.call( function(){
						self.correct.tweener
							.to({
								scaleX: self.beat.scaleX,
								scaleY: self.beat.scaleY,

							},20,"swing" )
							.wait( 300 )
							.call( function(){	//〇のアニメーションが終わったあと

								self.nextBeatkun();	//次のビートくんと迷彩背景決定処理

								self.time += plus;	//制限時間プラス処理
								self.timePlusLabel.text = '+' + plus / 1000;
								self.startTime = Date.now();	//開始時間をリセット

								//タイマーアニメーション（グワッと少し大きくなる）
								self.timeLabel.tweener
									.to({
										scaleX: 1.2,
										scaleY: 1.2,

									},50,"swing" )
									.call( function(){
										self.timeLabel.tweener
											.to({
												scaleX: 1.0,
												scaleY: 1.0,

											},50,"swing" )
										.play();
									})
								.play();
								
								
								//タイマープラスアニメーション（上にシュッとアニメーション）
								if( plus > 0 )
								{
									self.timePlusLabel.x = self.timeLabel.x;
									self.timePlusLabel.y = self.timeLabel.y;
									self.timePlusLabel.show();

									self.timePlusLabel.tweener
										.to({
											y: self.timePlusLabel.y - ( SCREEN_Y * 0.06 ),
											
										},200,"swing" )
										.wait( 200 )
										.call( function(){
											self.timePlusLabel.hide();
										})
									.play();	
								}
								
								self.score += 1;	//スコアプラス
							})
						.play();
					})
				.play();

				/*
				正解〇だけにする
				self.beatTouchLabel.show();
				self.beatTouchLabel.tweener	//"見つかっちゃった"ラベルアニメーション
					.to({
						x: self.beat.x,

					},300,"swing" )
					.wait( 300 )
					.call( function(){  //Tweenerが終わったら

					})
				.play();
				*/
				
			}

		};

		//画面全体をタッチしたとき（ゲームオーバー判定のため）
		this.onpointstart = function( e ) {
			
			if ( self.state !== 'playing' ) return; 	// ゲーム中以外はゲーム動作しない
			if ( self.time >= ( self.MAXTIME - 2 ) ) return;		// チュートリアルのボタンを押すとすぐに画面タッチが反応して×が出てしまうのを防ぐ

			//何かをタッチしていれば２重に反応しないように
			if( self.beatTouchFlg === TOUCH_WAITING )
			{
				// e.target が beatでなければ背景をタッチ
				if ( e.target !== self.beat )
				{
					SoundManager.play('incorrect');	//不正解サウンド

					self.beatTouchFlg = TOUCH_FALSE;	//ビート君タッチフラグ失敗

					self.incorrect.x = e.pointer.x;
					self.incorrect.y = e.pointer.y;
					
					//不正解× アニメーション開始
					self.incorrect.show();
					self.incorrect.tweener
					.to({
						scaleX: self.beat.scaleX + 0.2,
						scaleY: self.beat.scaleY + 0.2,

					},20,"swing" )
					.call( function(){

						//正解のビート君の場所を〇で表示する
						self.correct.x = self.beat.x;
						self.correct.y = self.beat.y;
						self.correct.setScale( self.beat.scaleX,self.beat.scaleY );
						self.correct.show();

						//"ここですよ！"ラベル アニメーション
						let a = self.calculateBeatTouchLabelPos();
						self.beatTouchLabel.show();
						self.beatTouchLabel.tweener
							.to({
								x: a.toX,
								y: a.toY,

							},200,"swing")
						.play();
						
						self.incorrect.tweener
							.to({
								scaleX: self.beat.scaleX,
								scaleY: self.beat.scaleY,

							},20,"swing" )
							.wait( 1500 )
							.call( function(){
								//肉球アニメーション
								self.nikyuAnimation();
								//self.exit( "result",{ score: self.score } );
							})
						.play();
					})
					.play();

      			}
			}
		};

		this.showTutorial();	//チュートリアル画面表示

	}, //end init


	//更新処理
	update: function( app ) {

		if ( this.state !== 'playing' ) return; // ゲーム中以外はゲーム動作しない
		if ( isPortrait ) return; 	   // 縦向き中はゲーム動作しない
		if( this.beatTouchFlg === 2 ) return;	//失敗したらタイマーを止める（マジックナンバーは良くない）

		let self = this;	//参照しておく

		//スコアラベル更新
		this.scoreLabel.text = this.score;
	
		//タイマー処理
		if( this.timeFlg === this.TIME_ON && this.beatTouchFlg !== 1 )
		{
			this.time -= app.deltaTime;
			let sec = this.time / 1000;	//秒数に変換
			this.timeLabel.text = sec.toFixed( 1 );
		}

		//タイムアップに移行
		if( this.time <= 0 )
		{
			if( this.timeFlg === this.TIME_ON )
			{
				this.state = 'timeup';	//状態をタイムアップに

				this.timeFlg = this.TIME_UP;
				this.time = 0.0;
				this.timeLabel.text = this.time.toFixed( 1 );
			}
		}

		//タイムアップ処理
		if( this.timeFlg === this.TIME_UP )
		{
			this.timeFlg = this.TIME_OFF;
			
			this.timeUpLabel.show();
			this.timeUpLabel.tweener	//タイムアップアニメーション（TODO:画像に変更する）
				.to({
					x: self.gridX.center(),
					
				},500,"swing" )
				.wait( 1000 )
				.call( function(){
					/*
					//リザルト画面へ移行
					self.exit( "result",{ score: self.score, mode: self.modeIndex } );
					*/

					//肉球アニメーション
					self.nikyuAnimation();
				})
			.play();
		}
	
	}, //end update

	/*
		@class nikyuAnimation()
		#リザルト画面に遷移する際の肉球アニメーション
	*/
	nikyuAnimation: function() {

		//if ( this.nikukyuIndex >= this.NIKYU_DATA.length )
		
		let data = this.NIKYU_DATA[ this.nikukyuIndex ];

		// スプライト作成
    	let sprite = Sprite('nikukyu').addChildTo( this );
    	sprite.setPosition( data.x, data.y );
		//sprite.setScale( (SCREEN_X_RATIO * data.scale),(SCREEN_Y_RATIO * data.scale) );	//スクリーンサイズに調整する
		sprite.setScale( ((SCREEN_X * 0.6 / 644 ) * data.scale ),((SCREEN_X * 0.6 / 644 ) * data.scale) );	//肉球の比率は変更せずにスクリーンに調整
		
		let wait = data.wait;

		this.nikukyuIndex ++;

		this.tweener
      		.wait( wait ) // 待機
      		.call(() => {
				if( this.nikukyuIndex >= this.NIKYU_DATA.length )
				{
					//すべての肉球を表示出来たらリザルト画面へ遷移
					this.exit( "result",{ score: this.score, mode: this.modeIndex } );
				}
				else
				{
					this.nikyuAnimation();
				}
        		
      		});

	}, // end nikyuAnimation()

	/*
		@class showTutorial()
		#チュートリアル画面を表示する
	*/
	showTutorial: function() {

		let self = this;	//参照しておく

		//黒いオーバーレイ
		const overlay = RectangleShape({
			width: SCREEN_X,
			height: SCREEN_Y,
			fill: 'rgba(0,0,0,0.6)',
			stroke: null,
		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center() );

		// チュートリアル用ラベル
		const labelHowto = Label({
			text: '遊び方',
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.035,
			fill: 'white',
			align: 'center',
			stroke: "black",
			strokeWidth: SCREEN_X * 0.0036,
		}).addChildTo( overlay ).setPosition( 0 , -(SCREEN_Y * 0.25) );	//overlayのポジションを基点としてオフセットしている

		// チュートリアル説明文
		let ruleText = "";
		if( this.modeIndex === 0 ){
			//ビート君モード
			ruleText = "隠れているビートくんをタッチして見つけよう！\n\n別の場所をタッチしたらゲームオーバーなので注意しよう！";
		
		}else{
			//長崎県モード
			ruleText = "隠れている長崎県をタッチして見つけよう！\n\n別の場所をタッチしたらゲームオーバーなので注意しよう！";
		
		}
		const labelRule = Label({
			text: ruleText,
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.03,
			fill: 'white',
			align: 'center',
			stroke: "black",
			strokeWidth: SCREEN_X * 0.0036,
		}).addChildTo( overlay ).setPosition( 0 , -(SCREEN_Y * 0.05) );
		
		// "はじめる"ボタン
		const button = Button({
			text: 'はじめる',
			fontFamily: 'DelaGothicOne',
			width: 180 * SCREEN_X_RATIO,
			height: 54 * SCREEN_Y_RATIO,
			cornerRadius: 8,
			fill: '#f4f4f4',
			fontColor: '#000000',
		}).addChildTo( overlay ).setPosition( 0 , (SCREEN_Y * 0.25) );
		button.fontSize = button.width * 0.18;	//フォントサイズ 調整
		
		// "はじめる"を押したらチュートリアルを閉じる
		button.onpointstart = function() {
			SoundManager.play('start');	//選択サウンド
			
			overlay.remove();

			self.state = 'countdown'; // カウントダウンへ移行
			self.count = 3;
    		self.countLabel.show();
    		self.startCountDown();	//カウントダウン スタート	
		};
		
	}, //end showTutorial()


	/*
		@class startCountDown()
		#カウントダウン処理
	*/
	startCountDown: function() {
	
		this.countLabel.text = this.count;
		this.countLabel.alpha = 0;
		this.countLabel.scale.set( 2, 2 );

		this.countLabel.tweener
		.clear()
		.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300)
		.wait( 700 )
		.call(() => {
			
			this.count--;

			if ( this.count > 0 ) {
			this.startCountDown();
			} else {
			this.countLabel.text = 'スタート！';
			this.countLabel.tweener
				.clear()
				.wait( 600 )
				.call(() => {
					this.countLabel.hide();
					this.state = 'playing';	//ゲームプレイに移行

					//ゲームプレイになったら表示
					this.scoreLabel.show();
					this.timeLabel.show();
					this.beat.show();

					this.startTime = Date.now();	//開始時間を記録
				});
			}
		});
			
	}, //end startCountDown()

	/*
		@class nextBeatkun()
		#次のビートくんと迷彩を決める処理
	*/
	nextBeatkun: function() {

		//表示されていたラベルを隠す
		this.beatTouchLabel.hide();
		this.correct.hide();

		//次の迷彩をどのように表示？
		this.camo1.frameIndex = Random.randint( 0,4 );
		this.camo2.frameIndex = Random.randint( 5,9 );
		this.camo3.frameIndex = Random.randint( 10,14 );

		/**
		 * 次のビート君をどのように表示するか？（要チェック！）
		**/
		
		//スコア20以上 一番難しい
		if( this.score >= 20 )
		{
			//座標調整
			this.beat.x = Random.randfloat( SCREEN_X * 0.05, SCREEN_X * 0.95 );
			this.beat.y = Random.randfloat( SCREEN_Y * 0.25, SCREEN_Y * 0.95 );

			//回転調整
			this.beat.rotation = Random.randint( 0,360 );
			
			//大きさ調整
			let rand =  Random.randfloat( 0.72,0.8 );
			this.beat.setScale( this.b_ratio * rand ,this.b_ratio * rand );

			//ビート君色変更（４色）
			this.beat.frameIndex = Random.randint( 0,3 );
		}
		//スコア15以上20以下
		else if( this.score >= 15 && this.score < 20 )
		{
			//座標調整
			this.beat.x = Random.randfloat( SCREEN_X * 0.1, SCREEN_X * 0.9 );
			this.beat.y = Random.randfloat( SCREEN_Y * 0.25, SCREEN_Y * 0.9 );
			
			//大きさ調整
			let rand =  Random.randfloat( 0.8,0.9 );
			this.beat.setScale( this.b_ratio * rand ,this.b_ratio * rand );

			//回転調整
			rand = Random.randint( 0,1 );
			if( rand ){
			
				this.beat.rotation = Random.randint( 0,180 );
			
			}else{
		
				this.beat.rotation = Random.randint( 181,360 );
		
			}

			//ビート君色変更（３色）
			this.beat.frameIndex = Random.randint( 0,2 );
		}
		//スコア10以上15以下
		else if( this.score >= 10 && this.score < 15 )
		{
			//座標調整
			this.beat.x = Random.randfloat( SCREEN_X * 0.1, SCREEN_X * 0.9 );
			this.beat.y = Random.randfloat( SCREEN_Y * 0.25, SCREEN_Y * 0.9 );
			
			//大きさ調整
			let rand =  Random.randfloat( 0.8,0.9 );
			this.beat.setScale( this.b_ratio * rand ,this.b_ratio * rand );

			//回転調整
			rand = Random.randint( 0,1 );
			if( rand ){
			
				this.beat.rotation = Random.randint( 0,180 );
			
			}else{
		
				this.beat.rotation = Random.randint( 181,360 );
		
			}

			//ビート君色変更（２色のみ）
			this.beat.frameIndex = Random.randint( 0,1 );
		}
		//スコア5以上10以下
		else if( this.score >= 5 && this.score < 10 )
		{
			//座標調整
			this.beat.x = Random.randfloat( SCREEN_X * 0.1, SCREEN_X * 0.9 );
			this.beat.y = Random.randfloat( SCREEN_Y * 0.25, SCREEN_Y * 0.9 );
			
			//大きさ調整
			let rand =  Random.randfloat( 0.8,0.95 );
			this.beat.setScale( this.b_ratio * rand ,this.b_ratio * rand );

			//ビート君色変更（２色のみ）
			this.beat.frameIndex = Random.randint( 0,1 );
		}
		//スコア2以上5以下
		else if( this.score >= 2 && this.score < 5 )
		{
			//座標調整
			this.beat.x = Random.randfloat( SCREEN_X * 0.15, SCREEN_X * 0.85 );
			this.beat.y = Random.randfloat( SCREEN_Y * 0.3, SCREEN_Y * 0.8 );
			
			//大きさ調整
			let rand =  Random.randfloat( 0.8,0.95 );
			this.beat.setScale( this.b_ratio * rand ,this.b_ratio * rand );
		}
		//1番易しい
		else
		{	
			//座標調整
			this.beat.x = Random.randfloat( SCREEN_X * 0.3, SCREEN_X * 0.7 );
			this.beat.y = Random.randfloat( SCREEN_Y * 0.4, SCREEN_Y * 0.7 );
		}
		
		this.beatTouchFlg = 0;	//タッチフラグOFF
			
	}, //end nextBeatkun()


	/*
		@class calculatePlusTimeByTime( clearTime )
		#ビート君を見つけた経過時間によってプラスタイムを決定する

		@param {Number}clearTime ...クリアタイム（秒数で）
		@return {Number}...ミリ秒でプラスタイム

	*/
	calculatePlusTimeByTime: function( clearTime ) {

		if ( clearTime <= 1.0 ) {
			
			return 500;

		} else if ( clearTime <= 1.5 ) {
			
			return 300;

		} else if ( clearTime <= 2 ) {
			
			return 100;

		} else {
			
			return 0;

		}
			
	}, //end calculatePlusTimeByTime()

	/*
		@class calculateBeatTouchLabelPos()
		#正解のビート君の位置にラベルを配置する際の座標を計算

	*/
	calculateBeatTouchLabelPos: function() {

		if ( this.beat.x >= this.gridX.center() && this.beat.y < this.gridY.center() ) {
			
			// 右上
			let to   = this.beat.x;
			let from = this.beat.x - (SCREEN_X * 0.05);

			this.beatTouchLabel.x = from;
			this.beatTouchLabel.y = this.beat.y + (SCREEN_Y * 0.15);

			return{
				toX: to,
				toY: this.beatTouchLabel.y,
			};

		} else if ( this.beat.x < this.gridX.center() && this.beat.y < this.gridY.center() ) {
			
			// 左上
			let to   = this.beat.x;
			let from = this.beat.x + (SCREEN_X * 0.05);

			this.beatTouchLabel.x = from;
			this.beatTouchLabel.y = this.beat.y + (SCREEN_Y * 0.15);
			
			return{
				toX: to,
				toY: this.beatTouchLabel.y,
			};

		} else if ( this.beat.x < this.gridX.center() && this.beat.y >= this.gridY.center() ) {
			
			// 左下
			let to   = this.beat.x;
			let from = this.beat.x + (SCREEN_X * 0.05);

			this.beatTouchLabel.x = from;
			this.beatTouchLabel.y = this.beat.y - (SCREEN_Y * 0.15);

			return{
				toX: to,
				toY: this.beatTouchLabel.y,
			};

		} else {
			
			// 右下
			let to   = this.beat.x;
			let from = this.beat.x - (SCREEN_X * 0.05);

			this.beatTouchLabel.x = from;
			this.beatTouchLabel.y = this.beat.y - (SCREEN_Y * 0.15);

			return{
				toX: to,
				toY: this.beatTouchLabel.y,
			};

		}
			
	}, //end calculateBeatTouchLabelPos()


}); //end MainScene


/**********************************************************


	ResultScene class
	#リザルト画面


**********************************************************/
phina.define("ResultScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		let self = this;	//参照用

		// 背景色
		this.backgroundColor = '#fbfbf9';

		//モードUIラベル（モードごとにテキスト変化）
		this.modeText = "ビートくんをさがせ";
		if( param.mode === 1 ) this.modeText = "長崎県をさがせ";

		this.modeUILabel = Label({
			text: this.modeText,
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.044,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.006,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.8 , SCREEN_Y * 0.12 );
		this.modeUILabel.tweener	//アニメーション開始
			.to({
				x: SCREEN_X * 0.5,

			},200,"swing" )
			.wait( 200 )
			.call( function(){	//スコアUIアニメーションが終わったら

				//ボタン関連 表示
				self.oneMoreButton.show();
				self.postButton.show();
				self.toTitleButton.show();

				//self.beatSprite.show();
				
				//リザルトテキスト アニメーション
				self.resultTextLabel.show();
				self.resultTextLabel.tweener
				.to({
					scaleX: 1, 
					scaleY: 1,

				},250,"easeOutBack" )
				.play();
			})
			.play();


		//"SCORE"ラベル
		this.scoreUILabel = Label({
			text: "SCORE",
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.042,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.006,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.2 , SCREEN_Y * 0.29 );
		this.scoreUILabel.tweener	//アニメーション開始
			.to({
				x: SCREEN_X * 0.5,
			},200,"swing" )
			.play();
		

		//スコア（点数）ラベル
		this.scoreLabel = Label({
			text: param.score,
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.078,
			fill: 'white',
			stroke: "#000000ff",
			strokeWidth : SCREEN_X * 0.0085,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.2 , SCREEN_Y * 0.43 );
		this.scoreLabel.tweener	//アニメーション開始
			.to({
				x: SCREEN_X * 0.5,
			},200,"swing" )
			.play();
		
		
		//リザルトテキスト（ ～級みたいな ）
		this.resultTextLabel = Label({
			text: this.getResultText( param.score ),
			fontFamily: 'DelaGothicOne',
			fontSize: SCREEN_X * 0.04,
			fill: 'white',
			stroke: "#002955",
			strokeWidth : SCREEN_X * 0.006,

		}).addChildTo( this ).setPosition( SCREEN_X * 0.5 , SCREEN_Y * 0.6 ).setScale( 2.0,2.0 );
		this.resultTextLabel.hide();

		// ビート君スプライト
		/*
    	this.beatSprite = Sprite('beat').addChildTo( this ).setPosition( SCREEN_X * 0.35 , SCREEN_Y * 0.6 );
		this.beatSprite.hide();
		*/
    	
		// 爪痕スプライト作成（左上）
		/*
    	this.scratch_1 = Sprite('scratch').addChildTo( this );
    	this.scratch_1.setPosition( SCREEN_X * 0.3 , SCREEN_Y * -0.5 );
		this.scratch_1.setScale( (SCREEN_X_RATIO * 1.2),(SCREEN_Y_RATIO * 1.2) );	//スクリーンサイズに調整する
		this.scratch_1.rotation = 45;
		this.scratch_1.tweener
			.to({
				x: SCREEN_X * 0.08,
				y: SCREEN_Y * 0.1,
				
			},200,"swing" )
			.wait( 200 )
			.call( function(){	//爪痕アニメーションが終わったら

				//スコアUIテキストをアニメーション
				self.scoreUILabel.show();
				self.scoreUILabel.tweener
				.to({
					x: SCREEN_X * 0.5,

				},200,"swing" )
				.wait(200)
				.call( function(){	//スコアUIアニメーションが終わったら

					self.oneMoreButton.show();
					self.postButton.show();

					self.beatSprite.show();
					//ビート君テキスト アニメーション
					self.beatTextLabel.show();
					self.beatTextLabel.tweener
					.to({
						x: SCREEN_X * 0.55,

					},200,"swing" )
					.play();
				})
				.play();

				//スコアをアニメーション
				self.scoreLabel.show();
				self.scoreLabel.tweener
				.to({
					x: SCREEN_X * 0.5,

				},200,"swing" )
				.play();
			})
		.play();
		*/

		// 爪痕スプライト作成（右下）
		/*
    	this.scratch_2 = Sprite('scratch').addChildTo( this );
    	this.scratch_2.setPosition( SCREEN_X * 0.5 , SCREEN_Y * 1.5 );
		this.scratch_2.setScale( (SCREEN_X_RATIO * 1.2),(SCREEN_Y_RATIO * 1.2) );	//スクリーンサイズに調整する
		this.scratch_2.rotation = 45;
		this.scratch_2.tweener
			.to({
				x: SCREEN_X * 0.88,
				y: SCREEN_Y * 0.95,
				
			},200,"swing" )
			.wait( 200 )
		.play();
		*/

		//"タイトルへ" ボタン
		this.toTitleButton = Button({
			text : 'タイトルへ',
			fontFamily: 'DelaGothicOne',
			fill : '#2d5030',
			fontColor: '#fbfbf9',
			width: 120 * SCREEN_X_RATIO,
			height: 40 * SCREEN_Y_RATIO,
	
		}).addChildTo( this ).setPosition( SCREEN_X * 0.12 , SCREEN_Y * 0.12 );
		this.toTitleButton.fontSize = this.toTitleButton.width * 0.15;	//フォントサイズ 調整
		this.toTitleButton.hide();
		//"タイトルへ"ボタンが押されたら（ iPhone/iPad/PC全部対応しているはず.. ）
		this.toTitleButton.onpointstart = function() {
			//タイトルシーンに遷移
			self.exit( "title" );
		};


		//"もう１回" ボタン
		this.oneMoreButton = Button({
			text : 'もう１回',
			fontFamily: 'DelaGothicOne',
			fill : '#2d5030',
			fontColor: '#fbfbf9',
			width: 200 * SCREEN_X_RATIO,
			height: 70 * SCREEN_Y_RATIO,
	
		}).addChildTo( this ).setPosition( SCREEN_X * 0.3 , SCREEN_Y * 0.8 );
		this.oneMoreButton.fontSize = this.oneMoreButton.width * 0.18;	//フォントサイズ 調整
		this.oneMoreButton.hide();
		//"もう１回"ボタンが押されたら（ iPhone/iPad/PC全部対応しているはず.. ）
		this.oneMoreButton.onpointstart = function() {
			//メインシーンに遷移
			self.exit( "main" ,{ mode: param.mode });
		};

		//"ポスト"ボタン
		this.postButton = Button({
			text : 'ポストする',
			fontFamily: 'DelaGothicOne',
			fill : '#2d5030',
			fontColor: '#fbfbf9',
			width: 200 * SCREEN_X_RATIO,
			height: 70 * SCREEN_Y_RATIO,
	
		}).addChildTo( this ).setPosition( SCREEN_X * 0.7 , SCREEN_Y * 0.8 );
		this.postButton.fontSize = this.postButton.width * 0.18;	//フォントサイズ 調整
		this.postButton.hide();

		//shareするデータ
		let params = {
			  hashtags: ["ビートくんをさがせ","BEASTX","Mリーグ"],	//ハッシュタグ
			  url: phina.global.location && phina.global.location.href,
		};

		//"ポスト"ボタンが押されたら（ iPhone/iPad/PC全部対応しているはず.. ）
		this.postButton.onpointstart = function() {
				
				let text = 'あなたの記録は{0}回！{1}'.format( param.score,self.getResultText( param.score ) );
		        let url = phina.social.Twitter.createURL({
		          text: text,
		          hashtags: params.hashtags,
		          url: params.url,

		        });
		        window.open( url, 'share window', 'width=480, height=320' );
		};
	
	}, //end init


	//更新処理
	update: function( app ) {

	}, //end update

	/*
		@class getResultText()
		#スコアごとのリザルトテキストを表示する

		@param {Number}score ...スコア変数

		@return table[i].text...リザルト用テキスト
	*/
	getResultText: function( score ) {

		const textTable = [
			{ min: 62, text: 'あなたは天に選ばれた・・！天和級' },
			{ min: 60, text: 'もう伝説級！役満九蓮宝燈級' },
			{ min: 58, text: '字牌がすべて集まった！役満字一色級' },
			{ min: 56, text: '全部揃えた！役満大三元級' },
			{ min: 54, text: 'カッコイイ役満国士無双級' },
			{ min: 52, text: 'ザ・役満四暗刻級' },
			{ min: 50, text: '見たか！リーヅモ一発清一色級' },
			{ min: 48, text: 'リーチホンイツどうだ小三元もだ！級' },
			{ min: 46, text: 'これは珍しい二盃口！級' },
			{ min: 44, text: 'リーヅモチートイ嬉しいウラウラ級' },
			{ min: 42, text: 'リーヅモ三暗刻ビックリ裏３も！級' },
			{ min: 40, text: 'やったね！リーヅモホンイツ級' },
			{ min: 38, text: 'メンタンピンツモ一発ドラ！級' },
			{ min: 36, text: '鳴いてアガった清一色級' },
			{ min: 34, text: 'こりゃ嬉しいダブリー一発ツモ級' },			
			{ min: 32, text: 'これでアガれるの！？チャンカン級' },
			{ min: 30, text: '鳴いてホンイツ満貫だよ！級' },
			{ min: 28, text: 'リーヅモ一通最高だね！級' },
			{ min: 26, text: 'リーヅモ三色気持ち良い級' },
			{ min: 24, text: 'ここにアガリ牌が！嶺上開花だぜ級' },
			{ min: 22, text: 'メンピンツモ裏ドラも乗った級' },
			{ min: 20, text: '最後まで粘ったハイテイツモ級' },
			{ min: 18, text: '鳴いてトイトイよく攻め切った級' },
			{ min: 16, text: '鳴いてチャンタよくかわしました級' },
			{ min: 14, text: '七対子ダマの技あり級' },
			{ min: 12, text: 'メンピンツモのアガリ級' },
			{ min: 10, text: '役牌ポン！早くアガったよ級' },
			{ min: 8,  text: '喰いタンで上手く流した級' },
			{ min: 6,  text: 'ピンフのみでアガった級' },
			{ min: 4,  text: 'テンパイまではいったよ級' },
			{ min: 2,  text: 'イーシャンテンいい調子ですね級' },
			{ min: 0,  text: 'もう少し頑張ってみよう級' },
		];

		for (let i = 0; i < textTable.length; i++) {
			if ( score >= textTable[i].min ) {
				return textTable[i].text;
			}
 		}
	}


});//end ResultScene


/**********************************************************


	phina.main
	#メイン処理


**********************************************************/
phina.main( function() {


	// アプリケーションを生成
	var app = GameApp({

		// MainScene から開始
		startLabel: 'title',

		width : SCREEN_X,
		height: SCREEN_Y,
		
		// アセット読み込み
		assets: ASSETS,

		//独自scene
		scenes: [
		   {
			className: 'TitleScene',
			label: 'title',
		   },

		   {
			className: 'MainScene',
			label: 'main',
		   },
		   
		   {
			className: 'ResultScene',
			label: 'result',
		   },

		]

	});

	
	// 実行
	app.run();
});

/**********************************************************

	checkOrientation()	
	#画面の向きを検出して制御（縦にすると警告がでるように）

**********************************************************/
function checkOrientation() {
  const overlay = document.getElementById('rotateOverlay');
  isPortrait = window.matchMedia("(orientation: portrait)").matches; //グローバル変数 注意！
  overlay.style.display = isPortrait ? 'flex' : 'none';

}

// 画面の向き起動時チェック
checkOrientation();

// Screen Orientation API（推奨）
if ( screen.orientation && screen.orientation.addEventListener ) {
  screen.orientation.addEventListener("change", checkOrientation);
}
// iOS Safari フォールバック
window.addEventListener("resize", checkOrientation);

/*
// 回転時にもチェック
window.addEventListener("orientationchange", () => {
  setTimeout( checkOrientation, 300 ); // 少し待ってから判定
});
*/
