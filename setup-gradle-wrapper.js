const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const templateDir = path.join(__dirname, 'android-template');

console.log('📦 Creating gradle wrapper...');

// Create gradle wrapper files
const gradleWrapper = {
  'gradlew': `#!/bin/sh
# Gradle wrapper script
exec java -cp "gradle/wrapper/gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain "$@"
`,
  'gradlew.bat': `@rem Gradle wrapper batch script
@java -cp "gradle/wrapper/gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
`,
  'gradle/wrapper/gradle-wrapper.properties': `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.3-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
};

// Create directories and files
for (const [filePath, content] of Object.entries(gradleWrapper)) {
  const fullPath = path.join(templateDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${filePath}`);
}

// Make gradlew executable on Unix-like systems
try {
  execSync(`chmod +x ${path.join(templateDir, 'gradlew')}`, { stdio: 'ignore' });
  console.log('✅ Made gradlew executable');
} catch (e) {
  console.log('Note: chmod not needed on Windows');
}

console.log('✨ Gradle wrapper setup complete!');