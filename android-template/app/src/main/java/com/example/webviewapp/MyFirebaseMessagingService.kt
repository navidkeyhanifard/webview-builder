package PACKAGE_NAME

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        remoteMessage.notification?.let {
            // نمایش نوتیفیکیشن
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // توکن جدید را به سرور خود بفرستید
    }
}