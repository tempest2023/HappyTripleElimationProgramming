import React, {
    FC,
    MouseEventHandler,
    useEffect,
    useRef,
    useState,
} from 'react';

import './App.css';
import {
    randomString,
    waitTimeout,
    getUrlParameters,
    getRandomElements,
} from './utils';
import { EasySvg, MediumSvg, HardSvg } from './tagSvg';
import { defaultTheme } from './themes/default';
import { Icon } from './themes/interface';
import { complainMessage, levelTitle, reviseCountLevel, rewardChance } from './levelConfig';
import { CodeEditor } from './editor';

const debug = true;
const QueueYPos = 850;

// 最大关卡
const maxLevel = 10;
const generatedNumForEachIcon = 6;

interface MySymbol {
    id: string;
    status: number; // 0->1->2
    isCover: boolean;
    x: number;
    y: number;
    icon: Icon;
}

type Scene = MySymbol[];

// 8*8网格  4*4->8*8
const makeScene: (level: number, icons: Icon[]) => Scene = (level, icons) => {
    const curLevel = level;
    const iconPool = icons.slice(0, 2 * curLevel);
    const offsetPool = [0, 25, -25, 50, -50].slice(0, 1 + curLevel);

    const scene: Scene = [];

    const range = [
        [2, 6],
        [1, 6],
        [1, 7],
        [0, 7],
        [0, 8],
    ][Math.min(4, curLevel - 1)];

    // 随机排列icon的位置
    const randomSet = (icon: Icon) => {
        const offset =
            offsetPool[Math.floor(offsetPool.length * Math.random())];
        const row =
            range[0] + Math.floor((range[1] - range[0]) * Math.random());
        const column =
            range[0] + Math.floor((range[1] - range[0]) * Math.random());
        scene.push({
            isCover: false,
            status: 0,
            icon,
            id: randomString(4),
            x: column * 100 + offset,
            y: row * 100 + offset,
        });
    };

    // 大于5级别重复增加icon池
    let compareLevel = curLevel;
    while (compareLevel > 0) {
        iconPool.push(
            ...iconPool.slice(0, Math.min(0, 2 * (compareLevel - 5)))
        );
        compareLevel -= 5;
    }

    for (const icon of iconPool) {
        for (let i = 0; i < generatedNumForEachIcon; i++) {
            randomSet(icon);
        }
    }

    return scene;
};

// 洗牌
const washScene: (level: number, scene: Scene) => Scene = (level, scene) => {
    const updateScene = scene.slice().sort(() => Math.random() - 0.5);
    const offsetPool = [0, 25, -25, 50, -50].slice(0, 1 + level);
    const range = [
        [2, 6],
        [1, 6],
        [1, 7],
        [0, 7],
        [0, 8],
    ][Math.min(4, level - 1)];

    const randomSet = (symbol: MySymbol) => {
        const offset =
            offsetPool[Math.floor(offsetPool.length * Math.random())];
        const row =
            range[0] + Math.floor((range[1] - range[0]) * Math.random());
        const column =
            range[0] + Math.floor((range[1] - range[0]) * Math.random());
        symbol.x = column * 100 + offset;
        symbol.y = row * 100 + offset;
        symbol.isCover = false;
    };

    for (const symbol of updateScene) {
        if (symbol.status !== 0) continue;
        randomSet(symbol);
    }

    return updateScene;
};

interface SymbolProps extends MySymbol {
    onClick: MouseEventHandler;
}

const Symbol: FC<SymbolProps> = ({ x, y, icon, isCover, status, onClick }) => {
    return (
        <div
            className="symbol"
            style={{
                transform: `translateX(${x}%) translateY(${y}%)`,
                backgroundColor: isCover ? '#999' : 'white',
                opacity: status < 2 ? 1 : 0,
            }}
            onClick={onClick}
        >
            <div
                className="symbol-inner"
                style={{ opacity: isCover ? 0.5 : 1 }}
            >
                {typeof icon.content === 'string' ? (
                    <i>{icon.content}</i>
                ) : (
                    icon.content
                )}
            </div>
        </div>
    );
};

const App: FC = () => {
    const [scene, setScene] = useState<Scene>(makeScene(1, defaultTheme.icons));
    const [level, setLevel] = useState<number>(1);
    const [queue, setQueue] = useState<MySymbol[]>([]);
    const [sortedQueue, setSortedQueue] = useState<
        Record<MySymbol['id'], number>
    >({});
    const [endlessMode, setEndlessMode] = useState<boolean>(false);
    const [reviseCount, setReviseCount] = useState<number>(0);
    const [refreshCount, setRefreshCount] = useState<number>(0);
    const [finished, setFinished] = useState<boolean>(false);
    const [tipText, setTipText] = useState<string>('');
    const [animating, setAnimating] = useState<boolean>(false);

    // 音效
    const soundRefMap = useRef<Record<string, HTMLAudioElement>>({});

    // 第一次点击时播放bgm
    const bgmRef = useRef<HTMLAudioElement>(null);
    const [bgmOn, setBgmOn] = useState<boolean>(false);
    const [once, setOnce] = useState<boolean>(false);
    const [toNextLevel, setToNextLevel] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [totalIcons, setTotalIcons] = useState<number>(0);
    const [timeHandle, setTimeHandle] = useState<any>(null);
    useEffect(() => {
        if (!bgmRef.current) return;
        if (bgmOn) {
            bgmRef.current.volume = 0.5;
            bgmRef.current.play();
        } else {
            bgmRef.current?.pause();
        }
    }, [bgmOn]);

    // 队列区排序
    useEffect(() => {
        const cache: Record<string, MySymbol[]> = {};
        for (const symbol of queue) {
            if (cache[symbol.icon.name]) {
                cache[symbol.icon.name].push(symbol);
            } else {
                cache[symbol.icon.name] = [symbol];
            }
        }
        const temp = [];
        for (const symbols of Object.values(cache)) {
            temp.push(...symbols);
        }
        const updateSortedQueue: typeof sortedQueue = {};
        let x = 50;
        for (const symbol of temp) {
            updateSortedQueue[symbol.id] = x;
            x += 100;
        }
        setSortedQueue(updateSortedQueue);
    }, [queue]);

    // 初始化覆盖状态和总量
    useEffect(() => {
        // 初始化道具数量
        if (level > maxLevel) {
            setReviseCount(5);
        } else {
            setReviseCount((reviseCountLevel[String(level)] as number) || 5);
        }
        if (level > maxLevel) {
            setRefreshCount(5);
        } else {
            setRefreshCount((reviseCountLevel[String(level)] as number) || 5);
        }
        setTotalIcons(scene.length || 0);
        checkCover(scene);
    }, []);

    // debug跳关
    useEffect(() => {
        if (!debug) return;
        const params = getUrlParameters();
        if (!params.progress && !params.level) return;
        const paramsProgress = parseInt(params.progress) || 0;
        const paramsLevel = parseInt(params.level) || 1;
        if (paramsProgress > 0 || paramsLevel > 1) {
            if (
                paramsProgress !==
                    Math.min(3, Math.floor((progress / totalIcons) * 3)) &&
                paramsLevel != level
            ) {
                restart(paramsLevel, paramsProgress / 3);
            } else if (paramsLevel != level) {
                restart(paramsLevel);
            } else if (
                paramsProgress !==
                Math.min(3, Math.floor((progress / totalIcons) * 3))
            ) {
                restart(level, paramsProgress / 3);
            }
        }
    }, []);

    // 向后检查覆盖
    const checkCover = (scene: Scene) => {
        const updateScene = scene.slice();
        for (let i = 0; i < updateScene.length; i++) {
            // 当前item对角坐标
            const cur = updateScene[i];
            cur.isCover = false;
            if (cur.status !== 0) continue;
            const { x: x1, y: y1 } = cur;
            const x2 = x1 + 100,
                y2 = y1 + 100;

            for (let j = i + 1; j < updateScene.length; j++) {
                const compare = updateScene[j];
                if (compare.status !== 0) continue;

                // 两区域有交集视为选中
                // 两区域不重叠情况取反即为交集
                const { x, y } = compare;

                if (!(y + 100 <= y1 || y >= y2 || x + 100 <= x1 || x >= x2)) {
                    cur.isCover = true;
                    break;
                }
            }
        }
        setScene(updateScene);
    };

    // 弹出
    const pop = () => {
        if (!queue.length) return;
        const updateQueue = queue.slice();
        const symbol = updateQueue.shift();
        if (!symbol) return;
        const find = scene.find((s) => s.id === symbol.id);
        if (find) {
            setQueue(updateQueue);
            find.status = 0;
            find.x = 100 * Math.floor(8 * Math.random());
            find.y = 700;
            checkCover(scene);
        }
    };

    // 撤销
    const undo = () => {
        if (!queue.length) return;
        const updateQueue = queue.slice();
        const symbol = updateQueue.pop();
        if (!symbol) return;
        const find = scene.find((s) => s.id === symbol.id);
        if (find) {
            setQueue(updateQueue);
            find.status = 0;
            checkCover(scene);
        }
        setReviseCount(reviseCount - 1);
    };

    // 洗牌
    const wash = () => {
        checkCover(washScene(level, scene));
        setRefreshCount(refreshCount - 1);
    };

    // 进入到下一关
    const levelUp = () => {
        if (!endlessMode && level >= maxLevel) {
            return;
        }
        setFinished(false);
        setLevel(level + 1);
        setQueue([]);
        const newScene = makeScene(level + 1, defaultTheme.icons);
        checkCover(newScene);
        setToNextLevel(false);
        setProgress(0);
        setTotalIcons(newScene.length || 1);
        setTipText('');
        // set revise count
        if (level > maxLevel) {
            setReviseCount(5);
        } else {
            setReviseCount(
                (reviseCountLevel[String(level + 1)] as number) || 5
            );
        }
        // set refresh count
        if (level > maxLevel) {
            setRefreshCount(5);
        } else {
            setRefreshCount(
                (reviseCountLevel[String(level + 1)] as number) || 5
            );
        }
        // clear time handle
        clearTimeout(timeHandle);
        setTimeHandle(null);
    };

    // 重开
    const restart = (level = 1, progress = 0) => {
        setToNextLevel(false);
        setFinished(false);
        setLevel(level);
        setQueue([]);
        const newScene = makeScene(level, defaultTheme.icons);
        checkCover(newScene);
        setTipText('');
        setProgress(Math.floor(progress * newScene.length));
        setTotalIcons(newScene.length || 1);
        // refresh revise count
        if (level > maxLevel) {
            setReviseCount(50);
        } else {
            setReviseCount((reviseCountLevel[String(level)] as number) || 5);
        }
        // set refresh count
        if (level > maxLevel) {
            setRefreshCount(5);
        } else {
            setRefreshCount((reviseCountLevel[String(level)] as number) || 5);
        }
        // clear time handle
        clearTimeout(timeHandle);
        setTimeHandle(null);
        setEndlessMode(false);
    };

    const continueTry = () => {
        setTipText('');
        setFinished(false);
    };

    // 进入无尽模式
    const enterEndlessMode = () => {
        setEndlessMode(true);
        levelUp();
    };

    // 抱怨
    const complain = () => {
        setTipText(getRandomElements(complainMessage));
    };

    // 点击icon
    const clickSymbol = async (idx: number) => {
        if (finished || animating) return;

        if (!once) {
            setBgmOn(true);
            setOnce(true);
        }

        const updateScene = scene.slice();
        const symbol = updateScene[idx];
        if (symbol.isCover || symbol.status !== 0) return;
        symbol.status = 1;

        // 点击音效
        if (soundRefMap.current) {
            soundRefMap.current[symbol.icon.clickSound].currentTime = 0;
            soundRefMap.current[symbol.icon.clickSound].play();
        }

        let updateQueue = queue.slice();
        updateQueue.push(symbol);

        setQueue(updateQueue);
        checkCover(updateScene);

        setAnimating(true);
        await waitTimeout(150);

        const filterSame = updateQueue.filter((sb) => sb.icon === symbol.icon);

        // 三连了
        if (filterSame.length === 3) {
            // 增加代码进度
            setProgress(progress + 3);
            // 增加道具数量
            const reward = getRandomElements(rewardChance);
            if (reward == 'revise') {
                setReviseCount(reviseCount + 1);
            } else if (reward == 'refresh') {
                setRefreshCount(refreshCount + 1);
            }
            updateQueue = updateQueue.filter((sb) => sb.icon !== symbol.icon);
            for (const sb of filterSame) {
                const find = updateScene.find((i) => i.id === sb.id);
                if (find) {
                    find.status = 2;
                    // 三连音效
                    if (soundRefMap.current) {
                        soundRefMap.current[
                            symbol.icon.tripleSound
                        ].currentTime = 0;
                        soundRefMap.current[symbol.icon.tripleSound].play();
                    }
                }
            }
        }

        // 输了
        if (updateQueue.length === 7) {
            setTipText(
                'Wrong Answer! Seems like you need more practice to solve it'
            );
            setFinished(true);
        }

        if (!updateScene.find((s) => s.status !== 2)) {
            // 胜利
            if (level === maxLevel) {
                setTipText('Good Job! You are the master of algorithm!');
                // setFinished(true);
                return;
            }
            setTipText('Congratulation! You have solved this problem!');
            setTimeout(() => {
                setTipText('');
            }, 500);
            setToNextLevel(true);
        } else {
            setQueue(updateQueue);
            checkCover(updateScene);
        }

        setAnimating(false);
    };
    const levelTitleForLevel = levelTitle.get(String(level));
    debug && console.log('[debug]', levelTitleForLevel);
    return (
        <>
            <div className="leetcode-viewport">
                <h2 className="problem-title">
                    {level} - {levelTitleForLevel?.title || 'Endless Mode'}
                    {levelTitleForLevel?.leetcodeLink && (
                        <a
                            title="leetcode link"
                            target="_blank"
                            href={levelTitleForLevel?.leetcodeLink || ''}
                            rel="noreferrer"
                        >
                            🔗
                        </a>
                    )}
                </h2>
                {levelTitleForLevel?.difficulty == 'Easy' ? (
                    <EasySvg />
                ) : levelTitleForLevel?.difficulty == 'Medium' ? (
                    <MediumSvg />
                ) : (
                    <HardSvg />
                )}
                <p className="problem-description">
                    {levelTitleForLevel?.description ||
                        'Enjoy your endless mode! Only Happy Triple Matching!'}
                </p>
                <CodeEditor
                    defaultCode={
                        levelTitleForLevel?.code &&
                        levelTitleForLevel?.code.length >
                            Math.min(3, Math.floor((progress / totalIcons) * 3))
                            ? levelTitleForLevel?.code[
                                  Math.min(
                                      3,
                                      Math.floor((progress / totalIcons) * 3)
                                  )
                              ]
                            : ''
                    }
                />
            </div>
            <div className="game-viewport">
                <div className="app">
                    <div className="scene-container">
                        <div className="scene-inner">
                            {scene.map((item, idx) => (
                                <Symbol
                                    key={item.id}
                                    {...item}
                                    x={
                                        item.status === 0
                                            ? item.x
                                            : item.status === 1
                                            ? sortedQueue[item.id]
                                            : -1000
                                    }
                                    y={item.status === 0 ? item.y : QueueYPos}
                                    onClick={() => clickSymbol(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="queue-container flex-container flex-center" />
                <div className="flex-container flex-between">
                    <button className="flex-grow" onClick={complain} hidden={toNextLevel}>
                        Too Hard
                    </button>
                    <button
                        className="flex-grow"
                        onClick={undo}
                        disabled={reviseCount === 0 || toNextLevel}
                    >
                        Revise({reviseCount})
                    </button>
                    {/* <button className="flex-grow" onClick={pop}>
                    Popup
                </button> */}
                    <button
                        className="flex-grow"
                        onClick={wash}
                        disabled={refreshCount === 0 || toNextLevel}
                    >
                        Refresh({refreshCount})
                    </button>
                    <button
                        className="flex-grow colorful-bg"
                        hidden={!toNextLevel}
                        onClick={levelUp}
                    >
                        Next
                    </button>
                </div>

                {tipText && tipText.length > 0 && (
                    <div className="modal">
                        <h1>{tipText}</h1>
                        <div className="flex-container flex-between">
                            <button
                                className="flex-grow"
                                onClick={() => restart(1, 0)}
                            >
                                Quit
                            </button>
                            <button className="flex-grow" onClick={continueTry}>
                                Continue
                            </button>
                            {level === maxLevel && (
                                <button
                                    className="flex-grow colorful-bg"
                                    onClick={enterEndlessMode}
                                >
                                    Endless Mode
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/*bgm*/}
                <button className="bgm-button" onClick={() => setBgmOn(!bgmOn)}>
                    {bgmOn ? '🎶' : '🔇'}
                    <audio ref={bgmRef} loop src="/sound-forget.mp3" />
                </button>

                <div className="bgm-gif-left" hidden={!bgmOn}>
                    <img className="bgm-gif-img" src="/doge.gif" />
                </div>
                <div className="bgm-gif-right" hidden={!bgmOn}>
                    <img className="bgm-gif-img" src="/doge.gif" />
                </div>

                {/*音效*/}
                {defaultTheme.sounds.map((sound) => (
                    <audio
                        key={sound.name}
                        ref={(ref) => {
                            if (ref) soundRefMap.current[sound.name] = ref;
                        }}
                        src={sound.src}
                    />
                ))}
            </div>
        </>
    );
};

export default App;
