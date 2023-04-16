import { EventEmitter } from 'events';

declare function on(eventName: "packetRead", listener: (...args: any[]) => void): void;
declare function on(eventName: "packetReadError", listener: (...args: any[]) => void): void;
declare function on(eventName: "packetRateLimitReached", listener: (...args: any[]) => void): void;
declare function on(eventName: "packetQueue", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverShutdown", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverTick", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverTimeTick", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverRegenerationTick", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverStarvationDamageTick", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverVoidDamageTick", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverGarbageCollection", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverOfflinePlayersGarbageCollection", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverToClientMessage", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverChatAsPlayer", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverGamemodeChange", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverCommandProcess", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverCommandProcessError", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverLogMessage", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverSetEntityData", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverUpdateChunkRadius", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverTimeUpdate", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverSetDifficulty", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverSetXP", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverSetHealth", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerFallDamageEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerRegenerationEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerDeathEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerHungerUpdate", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerHealthUpdate", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerLeave", listener: (...args: any[]) => void): void;
declare function on(eventName: "serverSetDimension", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerSetAttribute", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerTransferEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerKickEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerConnect", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerPreConnect", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerContainerOpen", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerContainerClose", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerInteractEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "blockBreakEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerFormResponse", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerHasAllResourcePacks", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerResourcePacksRefused", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerHasNoResourcePacksInstalled", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerSpawnEvent", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerResourcePacksCompleted", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerChangeGamemodeRequest", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerChat", listener: (...args: any[]) => void): void;
declare function on(eventName: "playerMalformatedChatMessage", listener: (...args: any[]) => void): void;

declare function on(eventName: string, listener: (...args: any[]) => void): void;

declare function once(eventName: string, listener: (...args: any[]) => void): void;
declare function emit(eventName: string): void;

declare function shutdownServer(): void;

declare const isDebug: boolean;
declare const eventEmitter: EventEmitter;

export {
  on,
  once,
  emit,
  isDebug,
  eventEmitter,
  shutdownServer,
};
