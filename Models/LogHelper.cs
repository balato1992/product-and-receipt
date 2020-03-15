using System;
using System.IO;

namespace product_and_receipt.Models
{
    public class LogHelper
    {
        private object Locker { get; set; }
        private string RootPath { get; set; }

        public LogHelper(string rootPath)
        {
            Locker = new object();
            RootPath = rootPath;
        }

        public void WriteLine(string message)
        {
            string path = Path.Combine(RootPath, DateTime.Now.ToString("yyyyMMdd_HH"));
            lock (Locker)
            {
                using StreamWriter file = new StreamWriter(path, true);

                file.WriteLine($"{DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")} - {message}");
            }
        }
        public void WriteLineException(string message, Exception ex)
        {
            WriteLine($"Error: {message}");
            WriteLine($"Exception: {ex}");
        }
    }
}
