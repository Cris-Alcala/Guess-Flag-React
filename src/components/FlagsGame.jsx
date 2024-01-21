/* eslint-disable react/no-unescaped-entities */
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import Ranking from "./Ranking";

const FlagsGame = () => {
  const [flagsGame, setFlagsGame] = useState({
    flags: {},
    flagsIndexes: [],
    playingFlag: "",
    totalRounds: 0,
  });
  const [game, setGame] = useState({
    wins: 0,
    timer: { minutes: 0, seconds: 0 },
    finish: undefined,
    stats: false,
  });
  const [ranking, setRanking] = useState([]);
  let interval = useRef();
  const flags_code_url = "https://flagcdn.com/es/codes.json";
  useEffect(() => {
    JSON.parse(localStorage.getItem("ranking")) !== null
      ? setRanking([...JSON.parse(localStorage.getItem("ranking"))] ?? [])
      : null;
  }, [flagsGame]);
  const restartGame = () => {
    setGame({ ...game, timer: { minutes: 0, seconds: 30 }, wins: 0 });
    clearInterval(interval.current);
    fetch(flags_code_url)
      .then((response) => response.json())
      .then((data) => {
        const gameFlagsData = [...Object.keys(data)];
        setFlagsGame({
          ...flagsGame,
          flags: { ...data },
          flagsIndexes: [...gameFlagsData],
          totalRounds: gameFlagsData.length,
        });
        passRound(gameFlagsData);
        setGame((prevGame) => {
          return { ...prevGame, finish: false };
        });
      });
  };
  const initCrono = () => {
    interval.current = setInterval(() => {
      setGame((prevGame) => {
        let minutes = prevGame.timer.minutes;
        let seconds = prevGame.timer.seconds;
        if (minutes > 0) {
          if (seconds === 0) {
            seconds = 59;
            minutes--;
          } else {
            seconds--;
          }
        } else if (minutes === 0 && seconds > 0) {
          seconds--;
        } else {
          clearInterval(interval.current);
          finishGame();
        }
        return { ...prevGame, timer: { minutes, seconds } };
      });
    }, 1000);
  };
  const handleStart = () => {
    restartGame();
    initCrono();
  };
  const passRound = (array) => {
    const limit = array.length - 1;
    const newIndex = Math.floor(Math.random() * (limit + 1));
    const newFlag = array[newIndex];
    setFlagsGame((prevFlagsGame) => {
      return { ...prevFlagsGame, playingFlag: newFlag };
    });
  };
  const handleWin = (e) => {
    const value = e.target.value.toLocaleLowerCase();
    e.target.value = "";
    return value === flagsGame.flags[flagsGame.playingFlag].toLocaleLowerCase();
  };
  const nextFlag = (e) => {
    if (e.key === "Enter") {
      if (flagsGame.flagsIndexes.length !== 0) {
        if (handleWin(e)) {
          setGame({ ...game, wins: game.wins + 1 });
          setFlagsGame({
            ...flagsGame,
            flagsIndexes: [
              ...flagsGame.flagsIndexes.filter(
                (flag) => flag !== flagsGame.playingFlag
              ),
            ],
            totalRounds: flagsGame.totalRounds - 1,
          });
        }
        passRound(flagsGame.flagsIndexes);
      } else finishGame();
    }
  };
  const finishGame = () => {
    setGame((prevGame) => {
      return { ...prevGame, finish: true, stats: true };
    });
  };
  const addUserOnRanking = (e) => {
    if (e.key === "Enter") {
      const rankingItem = {
        name: e.target.value,
        flags: game.wins,
      };
      const rankingPrev = [...ranking, { ...rankingItem }];
      setRanking([...rankingPrev]);
      localStorage.setItem("ranking", JSON.stringify([...rankingPrev]));
      setGame({ ...game, stats: false });
    }
  };
  return (
    <div className="mainGame">
      <div className="game">
        <button onClick={() => handleStart()}>Nuevo Juego</button>
        {!game.finish && game.finish !== undefined && (
          <div className="inputs">
            <div className="game-space">
              <input
                type="text"
                name="result"
                onKeyUp={nextFlag}
                autoComplete="off"
              />
              <p>Tip: Si no te sabes la bandera solo vale con pulsar "Enter"</p>
            </div>
            <div className="flag-info">
              <img
                src={`https://flagcdn.com/${flagsGame.playingFlag}.svg`}
                alt="Flag"
                width={200}
              />
              <p>Quedan {flagsGame.totalRounds} banderas</p>
              <p>Aciertos: {game.wins}</p>
              <p>
                Tiempo restante:{" "}
                {game.timer.minutes < 10
                  ? `0${game.timer.minutes}`
                  : game.timer.minutes}
                :
                {game.timer.seconds < 10
                  ? `0${game.timer.seconds}`
                  : game.timer.seconds}
              </p>
            </div>
          </div>
        )}
        {game.stats && (
          <div className="stats">
            <h2>¡Se acabó el tiempo!</h2>
            <h2>Añade tus estadísticas a nuestro ranking de jugadores</h2>
            <input
              type="text"
              name="name"
              onKeyUp={addUserOnRanking}
              autoComplete="off"
            />
          </div>
        )}
      </div>
      {ranking.length !== 0 && (
        <div className="ranking">
          <Ranking ranking={ranking} />
        </div>
      )}
    </div>
  );
};

export default FlagsGame;
