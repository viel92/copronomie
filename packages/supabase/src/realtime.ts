import type { SupabaseClient } from './client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  constructor(private supabase: SupabaseClient) {}

  /**
   * Écouter les changements sur une table
   */
  subscribeToTableChanges<T = any>(
    tableName: string,
    callback: (payload: any) => void,
    filter?: string
  ): any {
    const channelName = `${tableName}_${filter || 'all'}_${Date.now()}`
    
    let channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: tableName,
          ...(filter && { filter })
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * Écouter les changements sur les comparaisons d'un utilisateur
   */
  subscribeToUserComparisons(
    userId: string,
    callback: (payload: any) => void
  ): any {
    return this.subscribeToTableChanges(
      'comparisons',
      callback,
      `user_id=eq.${userId}`
    )
  }

  /**
   * Écouter les changements sur les copropriétés d'un utilisateur
   */
  subscribeToUserCoproprietes(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribeToTableChanges(
      'coproprietes',
      callback,
      `user_id=eq.${userId}`
    )
  }

  /**
   * Écouter les changements sur une comparaison spécifique
   */
  subscribeToComparison(
    comparisonId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribeToTableChanges(
      'comparisons',
      callback,
      `id=eq.${comparisonId}`
    )
  }

  /**
   * Créer une room pour la collaboration temps réel
   */
  createCollaborationRoom(
    roomId: string,
    onUserJoin?: (user: any) => void,
    onUserLeave?: (user: any) => void,
    onMessage?: (message: any) => void
  ): RealtimeChannel {
    const channel = this.supabase.channel(roomId, {
      config: {
        presence: {
          key: 'user_id'
        }
      }
    })

    if (onUserJoin) {
      channel.on('presence', { event: 'join' }, onUserJoin)
    }

    if (onUserLeave) {
      channel.on('presence', { event: 'leave' }, onUserLeave)
    }

    if (onMessage) {
      channel.on('broadcast', { event: 'message' }, onMessage)
    }

    channel.subscribe()
    this.channels.set(roomId, channel)
    
    return channel
  }

  /**
   * Rejoindre une room de collaboration
   */
  async joinCollaborationRoom(roomId: string, userInfo: any): Promise<void> {
    const channel = this.channels.get(roomId)
    if (channel) {
      await channel.track(userInfo)
    }
  }

  /**
   * Quitter une room de collaboration
   */
  async leaveCollaborationRoom(roomId: string): Promise<void> {
    const channel = this.channels.get(roomId)
    if (channel) {
      await channel.untrack()
    }
  }

  /**
   * Envoyer un message dans une room
   */
  async sendMessage(roomId: string, message: any): Promise<void> {
    const channel = this.channels.get(roomId)
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'message',
        payload: message
      })
    }
  }

  /**
   * Se désabonner d'un channel
   */
  unsubscribe(channelOrName: RealtimeChannel | string): void {
    if (typeof channelOrName === 'string') {
      const channel = this.channels.get(channelOrName)
      if (channel) {
        this.supabase.removeChannel(channel)
        this.channels.delete(channelOrName)
      }
    } else {
      this.supabase.removeChannel(channelOrName)
      // Trouver et supprimer le channel de la Map
      for (const [name, channel] of this.channels.entries()) {
        if (channel === channelOrName) {
          this.channels.delete(name)
          break
        }
      }
    }
  }

  /**
   * Se désabonner de tous les channels
   */
  unsubscribeAll(): void {
    for (const channel of this.channels.values()) {
      this.supabase.removeChannel(channel)
    }
    this.channels.clear()
  }

  /**
   * Obtenir le statut de connexion
   */
  getConnectionStatus(): string {
    return (this.supabase.realtime as any)?.connection?.state || 'disconnected'
  }

  /**
   * Écouter les changements de statut de connexion
   */
  onConnectionStatusChange(callback: (status: string) => void): void {
    const connection = (this.supabase.realtime as any)?.connection
    if (connection && connection.on) {
      connection.on('connectionstatechange', callback)
    }
  }
}