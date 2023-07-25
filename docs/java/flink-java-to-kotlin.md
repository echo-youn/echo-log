# Flink Java에서 코틀린으로

회사에서 Flink라는 자바 프레임워크를 다루어볼일이 있어서

::: code-group
```kotlin [FraoudDetector.kt]
package spendreport

import org.apache.flink.api.common.state.ValueState
import org.apache.flink.api.common.state.ValueStateDescriptor
import org.apache.flink.api.common.typeinfo.Types
import org.apache.flink.configuration.Configuration
import org.apache.flink.streaming.api.functions.KeyedProcessFunction
import org.apache.flink.util.Collector
import org.apache.flink.walkthrough.common.entity.Alert
import org.apache.flink.walkthrough.common.entity.Transaction

class FraoudDetector: KeyedProcessFunction<Long, Transaction, Alert>() {
    private val serialVersionUID = 1L

    private val SMALL_AMOUNT = 1.00
    private val LARGE_AMOUNT = 500.00
    private val ONE_MINUTE = (60 * 1000).toLong()

    @Transient
    private var flagState: ValueState<Boolean>? = null

    @Transient
    private var timerState: ValueState<Long>? = null

    override fun open(parameters: Configuration?) {
        val flagDescriptor = ValueStateDescriptor(
            "flag",
            Types.BOOLEAN
        )
        flagState = runtimeContext.getState(flagDescriptor)
        val timerDescriptor = ValueStateDescriptor(
            "timer-state",
            Types.LONG
        )
        timerState = runtimeContext.getState(timerDescriptor)
    }

    override fun processElement(
        transaction: Transaction,
        context: Context,
        collector: Collector<Alert?>
    ) {
        // Get the current state for the current key
        val lastTransactionWasSmall = flagState!!.value()

        // Check if the flag is set
        if (lastTransactionWasSmall != null) {
            if (transaction.amount > LARGE_AMOUNT) {
                //Output an alert downstream
                val alert = Alert()
                alert.id = transaction.accountId
                collector.collect(alert)
            }
            // Clean up our state
            cleanUp(context)
        }
        if (transaction.amount < SMALL_AMOUNT) {
            // set the flag to true
            flagState!!.update(true)
            val timer: Long = context.timerService().currentProcessingTime() + ONE_MINUTE
            context.timerService().registerProcessingTimeTimer(timer)
            timerState!!.update(timer)
        }
    }

    override fun onTimer(timestamp: Long, ctx: OnTimerContext?, out: Collector<Alert?>?) {
        // remove flag after 1 minute
        timerState!!.clear()
        flagState!!.clear()
    }

    private fun cleanUp(ctx: Context) {
        // delete timer
        val timer = timerState!!.value()
        ctx.timerService().deleteProcessingTimeTimer(timer)

        // clean up all state
        timerState!!.clear()
        flagState!!.clear()
    }
}

```

```kotlin [FraudDetectionJob.kt]
package spendreport

import org.apache.flink.streaming.api.datastream.DataStream
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment
import org.apache.flink.walkthrough.common.entity.Alert
import org.apache.flink.walkthrough.common.entity.Transaction
import org.apache.flink.walkthrough.common.sink.AlertSink
import org.apache.flink.walkthrough.common.source.TransactionSource

fun main(args: Array<String>) {
    val env = StreamExecutionEnvironment.getExecutionEnvironment()

    val source = TransactionSource()

    val transaction: DataStream<Transaction> = env.addSource(source)
        .name("transaction-1")

    val alert: DataStream<Alert> = transaction
        .keyBy(Transaction::getAccountId)
        .process(FraoudDetector())
        .name("fraud-detector")

    alert
        .addSink(AlertSink())
        .name("send-alert")

    env.execute("FraudDetec")
}

```

```properties [log4j2.properties]
################################################################################
#  Licensed to the Apache Software Foundation (ASF) under one
#  or more contributor license agreements.  See the NOTICE file
#  distributed with this work for additional information
#  regarding copyright ownership.  The ASF licenses this file
#  to you under the Apache License, Version 2.0 (the
#  "License"); you may not use this file except in compliance
#  with the License.  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
# limitations under the License.
################################################################################

rootLogger.level = WARN
rootLogger.appenderRef.console.ref = ConsoleAppender

logger.sink.name = org.apache.flink.walkthrough.common.sink.AlertSink
logger.sink.level = INFO

appender.console.name = ConsoleAppender
appender.console.type = CONSOLE
appender.console.layout.type = PatternLayout
appender.console.layout.pattern = %d{HH:mm:ss,SSS} %-5p %-60c %x - %m%n

```

```xml [pom.xml]
<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>frauddetection</groupId>
    <artifactId>frauddetection</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Flink Walkthrough DataStream Java</name>
    <url>https://flink.apache.org</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <flink.version>1.17.1</flink.version>
        <target.java.version>11</target.java.version>
        <scala.binary.version>2.12</scala.binary.version>
        <maven.compiler.source>${target.java.version}</maven.compiler.source>
        <maven.compiler.target>${target.java.version}</maven.compiler.target>
        <log4j.version>2.17.1</log4j.version>
        <kotlin.version>1.9.0</kotlin.version>
    </properties>

    <repositories>
        <repository>
            <id>apache.snapshots</id>
            <name>Apache Development Snapshot Repository</name>
            <url>https://repository.apache.org/content/repositories/snapshots/</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>

        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-walkthrough-common</artifactId>
            <version>${flink.version}</version>
        </dependency>

        <!-- This dependency is provided, because it should not be packaged into the JAR file. -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-java</artifactId>
            <version>${flink.version}</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-clients</artifactId>
            <version>${flink.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- Add connector dependencies here. They must be in the default scope (compile). -->

        <!-- Example:

        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>${flink.version}</version>
        </dependency>
        -->

        <!-- Add logging framework, to produce console output when running in the IDE. -->
        <!-- These dependencies are excluded from the application JAR by default. -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>${log4j.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>${log4j.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>${log4j.version}</version>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Kotlin Compiler -->
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <extensions>true</extensions> <!-- You can set this option
            to automatically take information about lifecycles -->
                <executions>
                    <execution>
                        <id>compile</id>
                        <goals>
                            <goal>compile</goal> <!-- You can skip the <goals> element
                        if you enable extensions for the plugin -->
                        </goals>
                        <configuration>
                            <sourceDirs>
                                <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                                <sourceDir>${project.basedir}/src/main/java</sourceDir>
                            </sourceDirs>
                        </configuration>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <goals> <goal>test-compile</goal> </goals> <!-- You can skip the <goals> element
                    if you enable extensions for the plugin -->
                        <configuration>
                            <sourceDirs>
                                <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                                <sourceDir>${project.basedir}/src/test/java</sourceDir>
                            </sourceDirs>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!-- Java Compiler -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <source>${target.java.version}</source>
                    <target>${target.java.version}</target>
                </configuration>
                <executions>
                    <!-- Replacing default-compile as it is treated specially by Maven -->
                    <execution>
                        <id>default-compile</id>
                        <phase>none</phase>
                    </execution>
                    <!-- Replacing default-testCompile as it is treated specially by Maven -->
                    <execution>
                        <id>default-testCompile</id>
                        <phase>none</phase>
                    </execution>
                    <execution>
                        <id>java-compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>java-test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!-- We use the maven-shade plugin to create a fat jar that contains all necessary dependencies. -->
            <!-- Change the value of <mainClass>...</mainClass> if your program entry point changes. -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.0.0</version>
                <executions>
                    <!-- Run shade goal on package phase -->
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <artifactSet>
                                <excludes>
                                    <exclude>org.apache.flink:flink-shaded-force-shading</exclude>
                                    <exclude>com.google.code.findbugs:jsr305</exclude>
                                    <exclude>org.slf4j:*</exclude>
                                    <exclude>org.apache.logging.log4j:*</exclude>
                                </excludes>
                            </artifactSet>
                            <filters>
                                <filter>
                                    <!-- Do not copy the signatures in the META-INF folder.
                                    Otherwise, this might cause SecurityExceptions when using the JAR. -->
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>spendreport.FraudDetectionJobKt</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
        <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
        <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
    </build>
</project>
```
:::
