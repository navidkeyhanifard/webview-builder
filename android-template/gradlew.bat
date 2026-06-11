@if not exist gradle\wrapper\gradle-wrapper.jar (
    mkdir gradle\wrapper
    curl -L -o gradle\wrapper\gradle-wrapper.jar https://github.com/gradle/gradle/raw/v8.4.0/gradle/wrapper/gradle-wrapper.jar
)
@java -cp "gradle/wrapper/gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*