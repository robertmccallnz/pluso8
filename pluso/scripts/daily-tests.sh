#!/bin/bash

# Set the directory to the project root
cd "$(dirname "$0")/.."

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to run tests and log results
run_test() {
    local test_name=$1
    local test_file=$2
    
    echo "Running ${test_name}..."
    deno test ${test_file} 2>&1 | tee -a "logs/${test_name}.log"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "✅ ${test_name} passed"
        return 0
    else
        echo "❌ ${test_name} failed"
        return 1
    fi
}

# Function to send notification on failure
notify_failure() {
    local test_name=$1
    local log_file="logs/${test_name}.log"
    echo "🚨 ${test_name} failed. Check logs at: ${log_file}"
}

# Get current timestamp
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "=== Daily Tests Started at ${timestamp} ===" >> logs/daily-tests.log

# Run filepath tests
run_test "filepath-tests" "tests/filepaths.test.ts"
filepath_status=$?

# Run API tests
run_test "api-tests" "tests/api.test.ts"
api_status=$?

# Run WebSocket tests
run_test "websocket-tests" "tests/websockets.test.ts"
websocket_status=$?

# Log final results
echo "=== Test Results ===" >> logs/daily-tests.log
echo "Filepath Tests: $([ $filepath_status -eq 0 ] && echo 'PASSED' || echo 'FAILED')" >> logs/daily-tests.log
echo "API Tests: $([ $api_status -eq 0 ] && echo 'PASSED' || echo 'FAILED')" >> logs/daily-tests.log
echo "WebSocket Tests: $([ $websocket_status -eq 0 ] && echo 'PASSED' || echo 'FAILED')" >> logs/daily-tests.log
echo "=== Daily Tests Completed at $(date '+%Y-%m-%d %H:%M:%S') ===" >> logs/daily-tests.log

# Check for failures and notify
if [ $filepath_status -ne 0 ]; then
    notify_failure "filepath-tests"
fi

if [ $api_status -ne 0 ]; then
    notify_failure "api-tests"
fi

if [ $websocket_status -ne 0 ]; then
    notify_failure "websocket-tests"
fi

# Exit with error if any test failed
[ $filepath_status -eq 0 ] && [ $api_status -eq 0 ] && [ $websocket_status -eq 0 ]
