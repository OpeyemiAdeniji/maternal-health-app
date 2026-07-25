from django.contrib import admin

from .models import LearnTopic


@admin.register(LearnTopic)
class LearnTopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'stage', 'category', 'order')
    list_filter = ('stage', 'category')
    search_fields = ('title', 'summary', 'content')
    ordering = ('stage', 'order')
